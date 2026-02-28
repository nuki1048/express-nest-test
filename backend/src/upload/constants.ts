import { ImageMimeType } from '../types/types';

export const ALLOWED_MIMES = [
  ImageMimeType.JPEG,
  ImageMimeType.PNG,
  ImageMimeType.WEBP,
  ImageMimeType.GIF,
] as const;

export const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const PATH_PATTERN = /^[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)+$/;

export const BUCKET = 'apartments';
