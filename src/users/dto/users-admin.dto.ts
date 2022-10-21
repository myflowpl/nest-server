import { RoleNames } from "../entities/user.entity";

export class AddRoleDto {
  userId: number;
  roleName: RoleNames;
}