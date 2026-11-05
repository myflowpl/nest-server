import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service.js';
import { User } from '../entities/user.entity.js';

@Injectable()
export class UsersService {

    constructor(
        private store: StoreService,
    ) { }

    async findOne(id: number): Promise<User | null> {
        return this.store.findOneBy(User, { id });
    }

}
