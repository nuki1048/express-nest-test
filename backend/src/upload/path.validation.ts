import { PATH_PATTERN } from './constants';

export const PATH_REQUIRED_MESSAGE =
  'Query "path" is required and must be a valid folder path (e.g. "apartments/record-id" or "blog-post/record-id").';

export function sanitizePath(path: string | undefined): string | null {
  if (!path || typeof path !== 'string') return null;
  const trimmed = path.trim();
  if (trimmed.includes('..') || trimmed.startsWith('/')) return null;
  return PATH_PATTERN.test(trimmed) ? trimmed : null;
}
