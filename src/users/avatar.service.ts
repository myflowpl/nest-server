import { BadRequestException, ForbiddenException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { AuthUser, RoleNames } from '../auth/auth.types.js';
import { ConfigService } from '../config/index.js';
import { PrismaService } from '../prisma/index.js';
import { detectImageType } from './image-type.js';
import { toUserView, userSelect, UserView } from './user.view.js';

/** Maksymalny rozmiar wgrywanego zdjęcia (bajty). */
export const MAX_AVATAR_SIZE = 4 * 1024 * 1024;

/** Avatary użytkowników: plik na dysku w UPLOAD_DIR, każdy upload to osobny rekord Photo, a profil wskazuje aktualny. */
@Injectable()
export class AvatarService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  /** Zapisuje avatar użytkownika `id`. Wgrać może on sam albo administrator; stare zdjęcia i pliki zostają. */
  async upload(actor: AuthUser, id: number, file: Express.Multer.File | undefined): Promise<UserView> {
    if (actor.id !== id && !actor.roles.includes(RoleNames.ADMIN)) {
      throw new ForbiddenException('Avatar może zmienić tylko właściciel konta lub administrator');
    }
    if (!file) {
      throw new BadRequestException('Brak pliku w polu "file"');
    }
    const profile = await this.prisma.profile.findUnique({ where: { userId: id }, select: { id: true } });
    if (!profile) {
      throw new NotFoundException('Użytkownik nie istnieje lub nie ma profilu');
    }
    const type = detectImageType(file.buffer);
    if (!type) {
      throw new BadRequestException('Dozwolone są tylko pliki JPEG, PNG lub WebP');
    }

    // nazwa na dysku jest nasza (nigdy od klienta)
    const fileName = `${randomUUID()}.${type.extension}`;
    const dir = resolve(this.config.UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, fileName), file.buffer);

    // multer czyta nazwę pliku jako latin1, więc polskie znaki trzeba odzyskać
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

    try {
      // jedno zapytanie: nowy rekord zdjęcia + ustawienie go jako avatara
      const user = await this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          avatar: { create: { userId: actor.id, fileName, originalName, mimeType: type.mimeType, size: file.size } },
        },
        select: { user: { select: userSelect } },
      });
      return toUserView(user.user);
    } catch (error) {
      await rm(join(dir, fileName), { force: true }); // nie zostawiamy pliku bez rekordu
      throw error;
    }
  }

  /** Bajty aktualnego avatara użytkownika. */
  async download(id: number): Promise<StreamableFile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: id },
      select: { avatar: { select: { fileName: true, mimeType: true } } },
    });
    if (!profile?.avatar) {
      throw new NotFoundException('Użytkownik nie ma avatara');
    }
    try {
      const data = await readFile(join(resolve(this.config.UPLOAD_DIR), profile.avatar.fileName));
      return new StreamableFile(data, { type: profile.avatar.mimeType });
    } catch {
      throw new NotFoundException('Plik avatara nie istnieje na dysku');
    }
  }
}
