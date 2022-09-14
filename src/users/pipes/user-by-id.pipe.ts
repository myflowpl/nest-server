import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private usersServic: UsersService,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {

    const id = parseInt(value, 10);

    if(!id) {
      throw new BadRequestException(`UserID param has to be numeric string`)
    }

    const user = await this.usersServic.findOne(id);

    if(!user) {
      throw new NotFoundException(`User for id ${id} not found`)
    }

    return user;
  }
}
