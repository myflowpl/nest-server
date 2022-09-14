import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from '../../store/store.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private store: StoreService,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    // return this.store.create(User, createUserDto)

    const user = this.userRepository.create(createUserDto);

    await this.userRepository.save(user);

    return user;
  }

  async findBy(query: Partial<User>): Promise<User[]> {
    // return this.store.findAll(User).then(
    //   users => users.filter(user => user.email === query.email)
    // )

    return this.userRepository.find({ where: query })
  }

  async findOne(id: number): Promise<User | null> {
    // return this.store.findOne(User, id);

    return this.userRepository.findOneBy({ id })
  }
}
