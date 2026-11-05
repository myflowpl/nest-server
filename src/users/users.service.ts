import { Injectable, NotImplementedException } from '@nestjs/common';
import { AuthUser, RoleNames } from '../auth/auth.types.js';
import { BulkBlockDto, ListUsersQueryDto, UserStatusName } from './users.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { toUserView, userSelect, UsersPage, UserView } from './user.view.js';
import { Prisma } from '../generated/prisma/client.js';

/**
 * Szkielet serwisu: kontroler i trasy już działają, ale każda metoda zwraca 501.
 * Kolejne metody zaimplementujesz w lekcjach D3-D7.
 */
@Injectable()
export class UsersService {


  constructor(private prisma: PrismaService) {}

/** Lista użytkowników: filtrowanie, sortowanie i stronicowanie wykonuje baza danych. */

  async list(query: ListUsersQueryDto): Promise<UsersPage> {
    
    const { search, role, pageIndex, pageSize, sortBy, sortDir } = query;

    // where budujemy z tego, co przyszło w zapytaniu
    const where: Prisma.UserWhereInput = {
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

  /** D3: użytkownik z profilem i rolami. */
  async findOne(id: number): Promise<UserView> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id }, select: userSelect });
    return toUserView(user);
  }

  /** D5: blokowanie / odblokowanie. */
  changeStatus(_actor: AuthUser, _id: number, _status: UserStatusName): Promise<unknown> {
    throw new NotImplementedException('changeStatus zaimplementujesz w lekcji D5');
  }

  /** D5: blokowanie wielu użytkowników naraz. */
  bulkBlock(_actor: AuthUser, _data: BulkBlockDto): Promise<unknown> {
    throw new NotImplementedException('bulkBlock zaimplementujesz w lekcji D5');
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
