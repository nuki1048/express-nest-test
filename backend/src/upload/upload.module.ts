import { Module } from '@nestjs/common';
import { ImageCompressionService } from '../services/image-compression.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, ImageCompressionService],
  exports: [UploadService],
})
export class UploadModule {}
