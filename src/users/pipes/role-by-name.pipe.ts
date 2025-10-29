import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { Role, RoleNames } from '../entities/user.entity';

@Injectable()
export class RoleByNamePipe implements PipeTransform {

  constructor(
    private store: StoreService,
  ) {}

  async transform(name: RoleNames, metadata: ArgumentMetadata) {

    const role = await this.store.findOneBy(Role, { name })

    if(!role) {
      throw new BadRequestException(`Role "${name}" not found`)
    }

    return role;
  }
}
