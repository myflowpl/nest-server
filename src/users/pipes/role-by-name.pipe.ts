import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { Role, RoleNames } from '../entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class RoleByNamePipe implements PipeTransform {
  
    constructor(
      private store: EntityManager,
    ){}
  
    async transform(name: RoleNames, metadata: ArgumentMetadata): Promise<Role> {
  
      // fetch role
      const role = await this.store.findOneBy(Role, { name })
  
      // if no role throw error
      if(!role) {
        throw new NotFoundException('Role Not Found')
      }
  
      // return
      return role;
    }
}
