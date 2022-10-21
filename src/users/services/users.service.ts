import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from '../../store/store.service';
import { AuthRegisterDto } from '../dto/auth.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    private store: StoreService,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(id: number): Promise<User | null> {

    return this.userRepository.findOneBy({ id });
  }

  async findBy(query: Partial<User>): Promise<User[]> {

    return this.userRepository.find({ where: query })
  }

  async create(data: AuthRegisterDto): Promise<User> {
    
    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    return user;
  }
}

