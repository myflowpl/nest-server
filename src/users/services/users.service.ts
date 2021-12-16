import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserRoleName, User, UserRole } from '../entities/user.entity';

@Injectable()
export class UsersService {
  private roles: UserRole[] = [
    new UserRole({ id: 1, name: UserRoleName.ROOT }),
    new UserRole({ id: 2, name: UserRoleName.ADMIN }),
  ];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = User.create(createUserDto);

    await User.save(user);

    return user;
  }

  async findBy(query: Partial<User>): Promise<User[]> {
    return User.find<User>(query);
  }

  async findAll(searchString?: string): Promise<User[]> {
    return User.find(); // TODO dodac customowy search stringa
  }

  async findOne(id: number): Promise<User | null> {
    return User.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return User.update({ id }, updateUserDto).then((res) => res.raw);
  }

  async remove(id: number): Promise<boolean> {
    const user = await User.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    await user.remove();

    return true;
  }

  async addRole(userId: number, roleName: UserRoleName): Promise<User> {
    const user = await this.findOne(userId);
    const role = this.roles.find((role) => role.name === roleName);
    user.roles.push(role);
    return user;
  }

  async removeRole(userId: number, roleName: UserRoleName): Promise<User> {
    const user = await this.findOne(userId);
    user.roles = user.roles.filter((role) => role.name !== roleName);
    return user;
  }
}
