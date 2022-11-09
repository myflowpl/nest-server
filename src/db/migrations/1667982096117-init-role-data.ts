import { NestFactory } from "@nestjs/core";
import { MigrationInterface, QueryRunner } from "typeorm"
import { AppModule } from "../../app.module";
import { Role, RoleNames, User } from "../../users/entities/user.entity";
import { AuthService } from "../../users/services/auth.service";

const email = 'admin@myflow.pl';

export class initRoleData1667982096117 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {

        const admin = new Role({
            name: RoleNames.ADMIN,
        });
        // admin.name = RoleNames.ADMIN;
        await queryRunner.manager.save(admin);

        const root = new Role();
        root.name = RoleNames.ROOT;
        await queryRunner.manager.save(root);

        // init aplikacji
        const app = await NestFactory.createApplicationContext(AppModule, {logger: false});
        const authService = app.get(AuthService);

        // dodanie konta admina i polaczenie go z rola admin
        const password = await authService.encodePassword('admin');

        const user = User.create({
            name: 'Admin',
            email,
            password,
            roles: [admin]
        });

        await queryRunner.manager.save(user);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // find id admin usera
        const [user] = await queryRunner.query('SELECT id FROM user WHERE email=?', [email]);
        // delete all roles assigned to this user
        await queryRunner.query('DELETE FROM user_roles_role WHERE userId=?', [user.id]);
        // delete the user
        await queryRunner.query('DELETE FROM user WHERE email=?', [email]);
        // delete roles
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ADMIN]);
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ROOT]);

    }

}
