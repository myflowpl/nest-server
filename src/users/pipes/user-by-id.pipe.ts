import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { User } from '../entities/user.entity';
import { EntityManager } from 'typeorm';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private store: UsersRepository,
  ){}

  async transform(value: string, metadata: ArgumentMetadata): Promise<User> {

    // validate & parse id
    const id = parseInt(value, 10);

    // if invalid id throw error
    if(!id) {
      throw new BadRequestException('Invalid user id')
    }

    // fetch user
    const user = await this.store.findOneBy({ id })

    // if no user throw error
    if(!user) {
      throw new NotFoundException('User Not Found')
    }

    // return
    return user;
  }
}
