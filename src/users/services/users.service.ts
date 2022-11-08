import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  constructor(
    private store: StoreService,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(id: number): Promise<User | null> {

    // return this.store.findOne(User, id);

    return this.userRepository.findOneBy({ id });
  }

  async findBy(query: Partial<User>): Promise<User[]> {
    // return this.store.findAll(User).then(
    //   users => users.filter(user => user.email === query.email)
    // )

    return this.userRepository.find({ where: query })
  }

  async create(data: Partial<User>): Promise<User> {
    
    // return this.store.create(User, data);

    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    return user;
  }
}
