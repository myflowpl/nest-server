import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleNames } from '../entities/user.entity';

@Injectable()
export class RoleByNamePipe implements PipeTransform {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async transform(name: RoleNames, metadata: ArgumentMetadata) {

    const role = await this.roleRepository.findOneBy({ name })

    if(!role) {
      throw new NotFoundException(`role ${name} not found`);
    }

    return role;
  }
}
