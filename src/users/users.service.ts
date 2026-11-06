import { Injectable, NotImplementedException } from '@nestjs/common';
import { AuthUser, RoleNames } from '../auth/auth.types.js';
import { BulkBlockDto, ListUsersQueryDto, UserStatusName } from './users.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { toUserView, userSelect, UsersPage, UserView } from './user.view.js';
import { Prisma, UserStatus } from '../generated/prisma/client.js';

/**
 * Szkielet serwisu: kontroler i trasy już działają, ale każda metoda zwraca 501.
 * Kolejne metody zaimplementujesz w lekcjach D3-D7.
 */

@Injectable()
export class UsersService {


  constructor(private prisma: PrismaService) {}

/** Lista użytkowników: filtrowanie, sortowanie i stronicowanie wykonuje baza danych. */

  async list(query: ListUsersQueryDto): Promise<UsersPage> {
    
    const { search, status, role, pageIndex, pageSize, sortBy, sortDir } = query;

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

  /** Użytkownik z profilem i rolami. Gdy go nie ma, Prisma rzuca P2025 (filtr zamienia to na 404). */
  async findOne(id: number): Promise<UserView> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id }, select: userSelect });
    return toUserView(user);
  }

    /**
   * Zmiana statusu (blokowanie / odblokowanie) razem z wpisem w dzienniku - w jednej transakcji.
   * Transakcja interaktywna: kolejne kroki zależą od poprzednich (najpierw czytamy, potem zapisujemy).
   */
  async changeStatus(actor: AuthUser, id: number, status: UserStatus): Promise<UserView> {

    await this.prisma.$transaction(async (tx) => {

      const user = await tx.user.findUniqueOrThrow({ where: { id }, select: { status: true } });
      if (user.status === status) {
        return; // nic się nie zmienia, więc nie ma czego zapisywać w dzienniku
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

  /** D7: nadanie roli. */
  addRole(_actor: AuthUser, _userId: number, _role: RoleNames): Promise<unknown> {
    throw new NotImplementedException('addRole zaimplementujesz w lekcji D7');
  }

  /** D7: odebranie roli (z regułą ostatniego administratora). */
  removeRole(_actor: AuthUser, _userId: number, _role: RoleNames): Promise<unknown> {
    throw new NotImplementedException('removeRole zaimplementujesz w lekcji D7');
  }
}
