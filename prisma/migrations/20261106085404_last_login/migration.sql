-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- uzupełnienie istniejących danych: dla dotychczasowych użytkowników przyjmujemy datę utworzenia konta
UPDATE "User" SET "lastLoginAt" = "createdAt";