import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { User } from '../entities/user.entity/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private store: StoreService,
  ) {}

  async findOneBy(where: Partial<User>): Promise<User> {
    return this.store.findOneBy(User, where);
  }
}
