import { MigrationInterface, QueryRunner } from "typeorm"
import { Role, RoleNames, User } from "../../users/entities/user.entity";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { AuthService } from "../../users/services/auth.service";

const email = 'root@myflow.pl';

export class SetRoleData1776242148374 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // create default roles in DB
        const root = new Role({name: RoleNames.ROOT});
        await queryRunner.manager.save(root);
        
        const admin = new Role({name: RoleNames.ADMIN});
        await queryRunner.manager.save(admin);

        // create root user
        const app = await NestFactory.createApplicationContext(AppModule, {logger: false});
        const authService = app.get(AuthService);

        //NOTICE tylko przyklad użycia DI LUB dla developmentu, hasla nie ustawiamy w ten sposob dla produkcji
        const password = await authService.encodePassword('!@#$'); 

        const user = new User({
            name: 'Root',
            email,
            password,
            roles: [root],
        })

        await queryRunner.manager.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // delete root user
        const user = await queryRunner.manager.findOneBy(User, { email });
        await queryRunner.manager.remove(user);

        // delete roles
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ADMIN]);
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ROOT]);
    }

}
