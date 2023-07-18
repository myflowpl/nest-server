import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private usersService: UsersService,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<User> {
    
    // validate & parse id as number
    const id = parseInt(value, 10);

    // if id invalid, throw error
    if(!id) {
      throw new BadRequestException(`User id is ivnalid`)
    }

    // fetch user
    const user = await this.usersService.findOneBy({ id });

    // if no user, throw not found error
    if(!user) {
      throw new NotFoundException(`User ${id} not found`)
    }

    return user;
  }
}
