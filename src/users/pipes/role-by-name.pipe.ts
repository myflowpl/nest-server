import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Role, RoleNames } from '../entities/user.entity.js';

// dostępne role (na razie bez bazy danych - lista z enuma RoleNames)
const ROLES = Object.values(RoleNames).map((name, index) => new Role({ id: index + 1, name }));

@Injectable()
export class RoleByNamePipe implements PipeTransform {

  async transform(name: RoleNames) {

    const role = ROLES.find(r => r.name === name);

    if(!role) {
      throw new NotFoundException(`Role ${name} not found`)
    }

    return role;
  }
}
