import { Injectable, NotImplementedException } from '@nestjs/common';
import { AuthUser, RoleNames } from '../auth/auth.types.js';
import { BulkBlockDto, ListUsersQueryDto, UserStatusName } from './users.dto.js';

/**
 * Szkielet serwisu: kontroler i trasy już działają, ale każda metoda zwraca 501.
 * Kolejne metody zaimplementujesz w lekcjach D3-D7.
 */
@Injectable()
export class UsersService {
  /** D4: lista z filtrami, sortowaniem i stronicowaniem. */
  list(_query: ListUsersQueryDto): Promise<unknown> {
    throw new NotImplementedException('Listę zaimplementujesz w lekcji D4');
  }

  /** D3: użytkownik z profilem i rolami. */
  findOne(_id: number): Promise<unknown> {
    throw new NotImplementedException('findOne zaimplementujesz w lekcji D3');
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
