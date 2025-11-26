import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { Role, RoleNames, User } from '../entities/user.entity';
import { PrismaService, Prisma } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(
        private store: StoreService,
        private prisma: PrismaService,
    ) { }

    async findOneBy(query: Partial<Omit<User, 'roles'>>) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: query.id,
                email: query.email,
                name: query.name,
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            return null;
        }

        // Mapowanie wyniku Prisma na encję User z rolami
        return new User({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            roles: user.roles.map(ur => new Role({
                id: ur.role.id,
                name: ur.role.name as RoleNames
            }))
        });
    }


    async create(user: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data: user
        });
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
