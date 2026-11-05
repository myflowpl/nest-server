import { Prisma } from '../generated/prisma/client.js';
import { RoleNames } from '../auth/auth.types.js';

/** Dokładnie te kolumny, których potrzebuje widok użytkownika (profil i role). */
export const userSelect = {
  id: true,
  email: true,
  createdAt: true,
  profile: { select: { displayName: true } },
  roles: { select: { role: { select: { name: true } } } },
} satisfies Prisma.UserSelect;

export type UserWithRelations = Prisma.UserGetPayload<{ select: typeof userSelect }>;

/** Kształt użytkownika w odpowiedziach API (inny niż kształt rekordów w bazie). */
export class UserView {
  id: number;
  email: string;
  displayName: string | null;
  roles: RoleNames[];
  createdAt: Date;
}

export function toUserView(user: UserWithRelations): UserView {
  return {
    id: user.id,
    email: user.email,
    displayName: user.profile?.displayName ?? null,
    roles: user.roles.map((userRole) => userRole.role.name as RoleNames),
    createdAt: user.createdAt,
  };
}
