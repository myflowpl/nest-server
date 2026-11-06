import { Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth/auth.types.js';
import { ApiAuth } from '../auth/decorators/api-auth.decorator.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { AvatarService, MAX_AVATAR_SIZE } from './avatar.service.js';

@Controller('users')
@ApiTags('Użytkownicy')
@ApiAuth()
export class UsersController {
  constructor(private avatarService: AvatarService) {}

  @Post(':id/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary', description: 'JPEG, PNG lub WebP, do 4 MB' } } } })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_AVATAR_SIZE } }))
  uploadAvatar(@Auth() actor: AuthUser, @Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
    return this.avatarService.upload(actor, id, file);
  }

  @Get(':id/avatar')
  downloadAvatar(@Param('id', ParseIntPipe) id: number) {
    return this.avatarService.download(id);
  }
}
