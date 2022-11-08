import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private store: StoreService,
  ) {}

  async findOne(id: number): Promise<User | null> {

    return this.store.findOne(User, id);
  }

  async findBy(query: Partial<User>): Promise<User[]> {
    return this.store.findAll(User).then(
      users => users.filter(user => user.email === query.email)
    )
  }

  async create(data: Partial<User>): Promise<User> {
    
    return this.store.create(User, data);
  }
}
