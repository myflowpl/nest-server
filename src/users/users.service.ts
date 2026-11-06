import { ConflictException, Injectable } from '@nestjs/common';
import { AuthUser, RoleNames } from '../auth/auth.types.js';
import { Prisma, UserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/index.js';
import { BulkBlockDto, ExportUsersQueryDto, ListUsersQueryDto } from './users.dto.js';
import { usersToCsv } from './users-csv.js';
import { toUserView, userSelect, UserView, UsersPage } from './user.view.js';

/** Serwis użytkowników panelu administracyjnego: odczyt, lista, zmiana statusu, blokada zbiorcza i role. */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /** Lista użytkowników: filtrowanie, sortowanie i stronicowanie wykonuje baza danych. */
  async list(query: ListUsersQueryDto): Promise<UsersPage> {
    const { search, role, status, pageIndex, pageSize, sortBy, sortDir } = query;

    // where budujemy z tego, co przyszło w zapytaniu
    const where: Prisma.UserWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { profile: { displayName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(role && { roles: { some: { role: { name: role } } } }),
    };

    // sortowanie po nazwie wyświetlanej wymaga sięgnięcia do relacji; drugi klucz (id) daje stabilną kolejność przy remisach
    const orderBy: Prisma.UserOrderByWithRelationInput[] = [
      sortBy === 'displayName' ? { profile: { displayName: sortDir } } : { [sortBy]: sortDir },
      { id: 'asc' },
    ];

    // dwa zapytania w jednej transakcji: strona rekordów + liczba wszystkich pasujących
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, orderBy, skip: pageIndex * pageSize, take: pageSize, select: userSelect }),
      this.prisma.user.count({ where }),
    ]);

    return { items: users.map(toUserView), total, pageIndex, pageSize };
  }

  /** Wszyscy użytkownicy (opcjonalnie z jednym statusem) jako CSV, bez stronicowania. */
  async exportCsv(query: ExportUsersQueryDto): Promise<string> {
    const { status } = query;
    const users = await this.prisma.user.findMany({
      where: { ...(status && { status }) },
      orderBy: { id: 'asc' },
      select: userSelect,
    });
    return usersToCsv(users.map(toUserView));
  }

  /** Użytkownik z profilem i rolami. Gdy go nie ma, Prisma rzuca P2025 (filtr zamienia to na 404). */
  async findOne(id: number): Promise<UserView> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id }, select: userSelect });
    return toUserView(user);
  }

  /**
   * Zmiana statusu (blokowanie / odblokowanie) razem z wpisem w dzienniku - w jednej transakcji.
   * Zablokować można każdego, ale nie ostatniego aktywnego administratora.
   */
  async changeStatus(actor: AuthUser, id: number, status: UserStatus): Promise<UserView> {
    await this.inTransaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id }, select: { status: true } });
      if (user.status === status) {
        return; // nic się nie zmienia, więc nie ma czego zapisywać w dzienniku
      }
      if (status === UserStatus.BLOCKED) {
        await this.assertNotLastAdmin(tx, id);
      }
      await tx.user.update({ where: { id }, data: { status } });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          action: status === UserStatus.BLOCKED ? 'user.block' : 'user.unblock',
          entity: 'User',
          entityId: id,
        },
      });
    });
    return this.findOne(id);
  }

  /** Blokowanie wielu użytkowników naraz. Administratorów pomijamy. Transakcja tablicowa. */
  async bulkBlock(actor: AuthUser, data: BulkBlockDto): Promise<{ blocked: number }> {
    const [result] = await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: { id: { in: data.ids }, roles: { none: { role: { name: RoleNames.ADMIN } } } },
        data: { status: UserStatus.BLOCKED },
      }),
      this.prisma.auditLog.create({
        data: { actorId: actor.id, action: 'user.bulk-block', entity: 'User', payload: { ids: data.ids } },
      }),
    ]);
    return { blocked: result.count };
  }

  /** Nadaje rolę. Wywołanie wielokrotne nic nie psuje (upsert). */
  async addRole(actor: AuthUser, userId: number, name: RoleNames): Promise<UserView> {
    await this.inTransaction(async (tx) => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });
      const role = await tx.role.findUniqueOrThrow({ where: { name } });
      await tx.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        update: {},
        create: { userId, roleId: role.id },
      });
      await tx.auditLog.create({
        data: { actorId: actor.id, action: 'role.add', entity: 'User', entityId: userId, payload: { role: name } },
      });
    });
    return this.findOne(userId);
  }

  /** Odbiera rolę. Roli admin nie można odebrać ostatniemu administratorowi. */
  async removeRole(actor: AuthUser, userId: number, name: RoleNames): Promise<UserView> {
    await this.inTransaction(async (tx) => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });
      if (name === RoleNames.ADMIN) {
        await this.assertNotLastAdmin(tx, userId);
      }
      await tx.userRole.deleteMany({ where: { userId, role: { name } } });
      await tx.auditLog.create({
        data: { actorId: actor.id, action: 'role.remove', entity: 'User', entityId: userId, payload: { role: name } },
      });
    });
    return this.findOne(userId);
  }

  /**
   * Transakcja interaktywna z poziomem izolacji Serializable.
   * Dwie równoległe operacje, które razem złamałyby regułę "ostatni admin", nie przejdą obie:
   * baza przerwie jedną z nich, a my zamieniamy to na czytelny błąd 409.
   */
  private async inTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    try {
      return await this.prisma.$transaction(fn, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (e: any) {
      // konflikt zapisu: z adapterem pg zwykle DriverAdapterError (TransactionWriteConflict), czasem kod P2034
      if (e?.code === 'P2034' || (e?.name === 'DriverAdapterError' && e?.cause?.kind === 'TransactionWriteConflict')) {
        throw new ConflictException('Konflikt współbieżnych operacji, spróbuj ponownie');
      }
      throw e;
    }
  }

  /** Reguła biznesowa: w systemie musi zostać co najmniej jeden aktywny administrator. */
  private async assertNotLastAdmin(tx: Prisma.TransactionClient, userId: number) {
    const target = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { roles: { select: { role: { select: { name: true } } } } },
    });
    const isAdmin = target.roles.some((r) => r.role.name === RoleNames.ADMIN);
    if (!isAdmin) {
      return;
    }

    const otherAdmins = await tx.user.count({
      where: {
        id: { not: userId },
        status: UserStatus.ACTIVE,
        roles: { some: { role: { name: RoleNames.ADMIN } } },
      },
    });
    if (otherAdmins === 0) {
      throw new ConflictException('W systemie musi zostać co najmniej jeden aktywny administrator');
    }
  }
}
