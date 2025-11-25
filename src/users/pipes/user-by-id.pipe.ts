import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private usersService: UsersService,
  ) {}

  async transform(userId: string, metadata: ArgumentMetadata): Promise<User> {

    // validate & parse id
    const id = parseInt(userId, 10);

    if(!id) {
      throw new BadRequestException('User id is invalid');
    }
    
    // fetch user
    const user = await this.usersService.findOneBy({ id })
    
    // validate user
    if(!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // return user
    return user;
  }
}
