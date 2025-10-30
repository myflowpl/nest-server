import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/db/prisma.service";
import { UsersService } from "../src/users/services/users.service";
import { RoleNames } from "../generated/prisma/enums";

async function bootstrap() {

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const usersService = app.get(UsersService);

  console.log('🌱 Running Prisma seed...');

  await prisma.role.deleteMany();
  await usersService.createRole({name: RoleNames.ADMIN})
  await usersService.createRole({name: RoleNames.ROOT})

  console.log('✅ Seed completed');

  await app.close();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});