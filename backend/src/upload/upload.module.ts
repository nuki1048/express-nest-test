import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ImageCompressionService } from '../services/image-compression.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [UploadService, ImageCompressionService],
  exports: [UploadService],
})
export class UploadModule {}
