import { MigrationInterface, QueryRunner } from "typeorm"
import { Role, RoleNames, User } from "../../users/entities/user.entity"
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { AuthService } from "../../users/services/auth.service";

const email = 'root@myflow.pl';

export class SetRolesData1689682552097 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const admin = new Role({name: RoleNames.ADMIN});
        await queryRunner.manager.save(admin);

        const root = new Role({name: RoleNames.ROOT});
        await queryRunner.manager.save(root);

        // app init
        const app = await NestFactory.createApplicationContext(AppModule, {logger: false});
        const authService = app.get(AuthService);

        const password = await authService.encodePassword('!@#$');

        const user = new User({
            name: 'Root',
            email,
            password,
            roles: [root]
        });

        await queryRunner.manager.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // fin id for root user
        // const user = await queryRunner.manager.findOneBy(User, { email });

        const [user] = await queryRunner.query('SELECT id FROM user WHERE email=?', [email]);

        // delete all roles assigned to root user
        await queryRunner.query('DELETE FROM user_roles_role WHERE userId=?', [user.id]);

        // delete the user
        await queryRunner.query('DELETE FROM user WHERE email=?', [email]);

        // delete roles
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ADMIN]);
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ROOT]);

    }

}
