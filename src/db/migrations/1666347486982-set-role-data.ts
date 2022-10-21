import { MigrationInterface, QueryRunner } from "typeorm"
import { Role, RoleNames } from "../../users/entities/user.entity"

export class setRoleData1666347486982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const admin = new Role();
        admin.name = RoleNames.ADMIN;
        await queryRunner.manager.save(admin);

        const root = new Role();
        root.name = RoleNames.ROOT;
        await queryRunner.manager.save(root);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ADMIN]);
        await queryRunner.query('DELETE FROM role WHERE name=?', [RoleNames.ROOT]);
    }

}
