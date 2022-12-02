import { MigrationInterface, QueryRunner } from "typeorm"
import { Role, RoleNames } from "../../users/entities/user.entity/user.entity";

export class roleData1669989809522 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const manager = queryRunner.manager;

        const admin = new Role({name: RoleNames.ADMIN});
        await manager.save(admin);

        const root = new Role({name: RoleNames.ROOT});
        await manager.save(root);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`DELETE FROM role WHERE name=?`, [RoleNames.ADMIN]);
        await queryRunner.query(`DELETE FROM role WHERE name=?`, [RoleNames.ROOT]);

    }

}
