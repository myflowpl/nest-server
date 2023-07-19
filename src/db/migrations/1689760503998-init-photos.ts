import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPhotos1689760503998 implements MigrationInterface {
    name = 'InitPhotos1689760503998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, CONSTRAINT "UQ_391cb98c1b40d39b6b7d9bfdf07" UNIQUE ("filename"))`);
        await queryRunner.query(`CREATE TABLE "temporary_photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, CONSTRAINT "UQ_391cb98c1b40d39b6b7d9bfdf07" UNIQUE ("filename"), CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_photo"("id", "filename", "description", "createdAt", "updatedAt", "userId") SELECT "id", "filename", "description", "createdAt", "updatedAt", "userId" FROM "photo"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo" RENAME TO "photo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" RENAME TO "temporary_photo"`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, CONSTRAINT "UQ_391cb98c1b40d39b6b7d9bfdf07" UNIQUE ("filename"))`);
        await queryRunner.query(`INSERT INTO "photo"("id", "filename", "description", "createdAt", "updatedAt", "userId") SELECT "id", "filename", "description", "createdAt", "updatedAt", "userId" FROM "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "photo"`);
    }

}
