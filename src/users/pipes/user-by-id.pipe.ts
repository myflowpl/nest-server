import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {

  constructor(
    private usersService: UsersService,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {

    // validate & parse string id
    const id = parseInt(value, 10);

    // check if exists if not throw 400 error
    if(!id) {
      throw new BadRequestException(`id "${value}" is not valid numeric string`)
    }

    // fetch user
    const user = await this.usersService.findOneBy({ id })

    // check if user exits, if not throw 400
    if(!user) {
      throw new BadRequestException(`User do not exits`)
    }

    // return user
    return user;
  }

}
