import {
  Controller,
  Delete,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { ALLOWED_MIMES, MAX_SIZE } from './constants';
import { ImageCompressionService } from '../services/image-compression.service';
import { PATH_REQUIRED_MESSAGE, sanitizePath } from './path.validation';
import type { MulterFile } from './upload.types';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly imageCompression: ImageCompressionService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
    }),
  )
  async upload(
    @UploadedFile() file: MulterFile | undefined,
    @Query('path') path?: string,
  ): Promise<{ url: string }> {
    if (!file?.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    if (!(ALLOWED_MIMES as readonly string[]).includes(file.mimetype ?? '')) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${ALLOWED_MIMES.join(', ')}`,
      );
    }
    const pathPrefix = sanitizePath(path);
    if (!pathPrefix) {
      throw new BadRequestException(PATH_REQUIRED_MESSAGE);
    }
    const payload = await this.imageCompression.compress(
      file.buffer,
      file.mimetype,
      file.originalname ?? 'image',
    );
    const url = await this.uploadService.uploadFile(payload, pathPrefix);
    return { url };
  }

  @Delete()
  async delete(@Query('path') path?: string): Promise<void> {
    const storageKey = sanitizePath(path);
    if (!storageKey) {
      throw new BadRequestException(PATH_REQUIRED_MESSAGE);
    }
    await this.uploadService.deleteFile(storageKey);
  }
}
