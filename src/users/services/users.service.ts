import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        private store: StoreService,
    ) {}

    async findOneBy(query: Partial<User>) {
        return this.store.findOneBy(User, query)
    }

    async save(user: User) {

        return this.store.save(user);

    }
}
