import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PATH_REQUIRED_MESSAGE, sanitizePath } from './path.validation';

@Injectable()
export class UploadPathPipe implements PipeTransform<string | undefined> {
  transform(value: string | undefined): string {
    const sanitized = sanitizePath(value);
    if (!sanitized) {
      throw new BadRequestException(PATH_REQUIRED_MESSAGE);
    }
    return sanitized;
  }
}
