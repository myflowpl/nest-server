import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { Role, RoleNames, User } from '../entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(
        private store: StoreService,
        private prisma: PrismaService,
    ){}

    async findOneBy(query: Partial<User>) {
        return this.store.findOneBy(User, query);
    }

    async save(user: User) {
        return this.store.save(user);
    }

    async getRoles() {
        return this.store.find(Role);
    }

    async getRoleByName(name: RoleNames) {
        return this.store.findOneBy(Role, { name });
    }
}
