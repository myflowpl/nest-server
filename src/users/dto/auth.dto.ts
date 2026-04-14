import { User } from "../entities/user.entity";

export class MeResponse {
    user: User;
    token: string;
}
