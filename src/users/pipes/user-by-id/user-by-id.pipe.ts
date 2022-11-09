import { ArgumentMetadata, Injectable, PipeTransform, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private usersService: UsersService,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const id = parseInt(value, 10);

    if(!id) {
      throw new BadRequestException(`User id is invalid`);
    }

    const user = await this.usersService.findOne(id);

    if(!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

}
