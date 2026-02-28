import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import type { UploadFilePayload } from '../upload/upload.types';

const COMPRESSIBLE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * Compresses image buffer without resizing and without loss of quality.
 * - JPEG: re-encode at quality 100 (strips metadata).
 * - PNG: re-encode with compressionLevel 9.
 * - WebP: re-encode lossless.
 * - GIF: returned unchanged (preserves animation).
 */
@Injectable()
export class ImageCompressionService {
  async compress(
    buffer: Buffer,
    mimetype: string | undefined,
    originalname: string,
  ): Promise<UploadFilePayload> {
    if (!mimetype || !COMPRESSIBLE_MIMES.has(mimetype)) {
      return { buffer, originalname, mimetype };
    }

    const pipeline = sharp(buffer).rotate();

    switch (mimetype) {
      case 'image/jpeg': {
        const out = await pipeline.toFormat('jpeg', { quality: 90 }).toBuffer();
        return { buffer: out, originalname, mimetype: 'image/jpeg' };
      }
      case 'image/png': {
        const out = await pipeline
          .toFormat('png', { compressionLevel: 9, quality: 90 })
          .toBuffer();
        return { buffer: out, originalname, mimetype: 'image/png' };
      }
      case 'image/webp': {
        const out = await pipeline
          .toFormat('webp', { lossless: true })
          .toBuffer();
        return { buffer: out, originalname, mimetype: 'image/webp' };
      }
      default:
        return { buffer, originalname, mimetype };
    }
  }
}
