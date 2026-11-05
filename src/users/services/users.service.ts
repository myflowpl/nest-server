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

    async create(createUserDto: Partial<User>): Promise<User> {
        return this.store.save(new User(createUserDto));
    }

    async findBy(query: Partial<User>): Promise<User[]> {
        const users = await this.store.find(User);
        return users.filter(user => user.email === query.email);
    }
}
