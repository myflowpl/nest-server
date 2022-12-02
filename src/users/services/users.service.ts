import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { User } from '../entities/user.entity/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private store: StoreService,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return this.store.findOne(User, id);
  }
}
