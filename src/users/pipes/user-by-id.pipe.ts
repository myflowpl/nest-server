import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private usersService: UsersService,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {

    // parsowanie i walidacja id
    const id = parseInt(value, 10);

    if(!id) {
      throw new BadRequestException(`user id should be numeric string`)
    }

    // pobranie usera
    const user = await this.usersService.findOne(id);

    if(!user) {
      throw new NotFoundException(` user for id ${id} not found`)
    }

    // zwrota usera
    return user;
  }
}
