import { Injectable } from '@nestjs/common';
import { StorageService } from '../../storage/storage.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private storage: StorageService,
  ) {}

  async findBy(query: Partial<User>): Promise<User[]> {
    return this.storage.findAll(User).then(
      users => users.filter(user => user.email === query.email)
    )
  }

  async create(createUserDto: Partial<User>): Promise<User> {
    return this.storage.create(User, createUserDto);
  }

  async findOne(id: number): Promise<User | null> {
    return this.storage.findOne(User, id);
  }
}
