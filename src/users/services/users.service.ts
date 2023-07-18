import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { Role, User } from '../entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        private manager: EntityManager,
    ) {}

    async findOneBy(query: Partial<User>) {
        return this.manager.findOneBy(User, query)
    }

    async save(user: User) {

        return this.manager.save(user);

    }

    async getRoles() {
        return this.manager.find(Role);

    }
}
