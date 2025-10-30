import { Injectable } from '@nestjs/common';
import { Role, User } from '../entities/user.entity';
import { PrismaService, Prisma } from '../../db/prisma.service';

@Injectable()
export class UsersService {

    constructor(
        private db: PrismaService,
    ){}

    async findOneBy(query: Prisma.UserWhereUniqueInput) {

        return this.db.user.findUnique({
            where: query
        })
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.db.user.create({
            data,
        });
    }

    async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
        return this.db.role.create({
            data,
        });
    }

    // async updateUser(params: {
    //     where: Prisma.UserWhereUniqueInput;
    //     data: Prisma.UserUpdateInput;
    // }): Promise<User> {
    //     const { where, data } = params;
    //     return this.db.user.update({
    //     data,
    //     where,
    //     });
    // }

    // async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    //     return this.db.user.delete({
    //     where,
    //     });
    // }
}
