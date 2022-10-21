import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private userService: UsersService,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {

    const id = parseInt(value, 10);

    if(!id) {
      throw new BadRequestException('User ID param is invalid')
    }

    const user = await this.userService.findOne(id);

    if(!user) {
      throw new NotFoundException(`User for id ${id} not found`);
    }

    return user;
  }
}
