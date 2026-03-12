import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ALLOWED_MIMES } from './constants';
import type { MulterFile } from './upload.types';

@Injectable()
export class UploadFilePipe implements PipeTransform<MulterFile | undefined> {
  transform(value: MulterFile | undefined): MulterFile {
    if (!value?.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    const mimetype = value.mimetype ?? '';
    if (!(ALLOWED_MIMES as readonly string[]).includes(mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${ALLOWED_MIMES.join(', ')}`,
      );
    }
    return value;
  }
}
