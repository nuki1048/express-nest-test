import { ImageMimeType } from '../../../types/types';

/** Public labels for the field. */
export const LABELS = {
  mainPhoto: 'Main photo',
  photos: 'Photos (multiple)',
} as const;

export const UPLOAD_URL = '/api/upload';
export const DEFAULT_SAVE_FIRST_MESSAGE =
  'Save the record first so files are stored in its folder.';
export const IMAGE_ACCEPT = [
  ImageMimeType.JPEG,
  ImageMimeType.PNG,
  ImageMimeType.WEBP,
  ImageMimeType.GIF,
] as const;
export const UPLOAD_ERROR_FALLBACK = 'Upload failed';

/** MIME type to extensions map for react-dropzone accept. */
export const IMAGE_ACCEPT_MAP = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
} as const;

/** Thumbnail size in px; used for grid and card width. */
export const THUMB_SIZE = 160;

/** Grid layout for thumbnail lists (edit and show). */
export const THUMB_GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 12,
} as const;

/** Preview image style while files are uploading. */
export const UPLOADING_PREVIEW_STYLE = {
  maxHeight: 200,
  objectFit: 'contain' as const,
};
