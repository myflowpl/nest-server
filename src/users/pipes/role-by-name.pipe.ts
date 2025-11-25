import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { RoleNames } from '../entities/user.entity';

@Injectable()
export class RoleByNamePipe implements PipeTransform {

  constructor(
    private usersService: UsersService
  ){}

  async transform(name: RoleNames, metadata: ArgumentMetadata) {

    const role = await this.usersService.getRoleByName(name);

    if(!role) {
      throw new NotFoundException(`Role "${name}" not found`)
    }

    return role;
  }
}
