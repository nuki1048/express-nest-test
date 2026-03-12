import {
  Controller,
  Delete,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { ImageCompressionService } from '../services/image-compression.service';
import { MAX_SIZE } from './constants';
import type { MulterFile } from './upload.types';
import { UploadFilePipe } from './upload-file.pipe';
import { UploadPathPipe } from './upload-path.pipe';
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
    @UploadedFile(UploadFilePipe) file: MulterFile,
    @Query('path', UploadPathPipe) path: string,
  ): Promise<{ url: string }> {
    const payload = await this.imageCompression.compress(
      file.buffer,
      file.mimetype,
      file.originalname ?? 'image',
    );
    const url = await this.uploadService.uploadFile(payload, path);
    return { url };
  }

  @Delete()
  async delete(@Query('path', UploadPathPipe) path: string): Promise<void> {
    await this.uploadService.deleteFile(path);
  }
}
