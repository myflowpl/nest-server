import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../../storage/storage.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private storage: StorageService,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findBy(query: Partial<User>): Promise<User[]> {
    return this.userRepository.find({ where: query })
  }

  async create(createUserDto: Partial<User>): Promise<User> {
    
    const user = this.userRepository.create(createUserDto);

    await this.userRepository.save(user);

    return user;
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id })
  }
}
