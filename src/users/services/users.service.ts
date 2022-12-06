import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StoreService } from '../../store/store.service';
import { Role, RoleNames, User } from '../entities/user.entity/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private store: StoreService,
    private manager: StoreService,
    // private manager: EntityManager,
  ) {}

  async find(page: number, pageSize = 10): Promise<User[]> {
    // return this.store.findOne(User, id);

    return this.manager.find(User, { take: pageSize, skip: page*pageSize })
  }

  async findOne(id: number): Promise<User | null> {
    // return this.store.findOne(User, id);

    return this.manager.findOneBy(User, { id })
  }

  async create(data: Partial<User>): Promise<User> {
    // return this.store.create(User, data);

    const user = new User(data);

    await this.manager.save(user);
    
    return user;
  }

  async findOneBy(where: Partial<User>): Promise<User> {

    // return this.store.findAll(User).then(
    //   users => users.filter(user => user.email === query.email)
    // )

    return this.manager.findOneBy(User, where);
    
  }
}
