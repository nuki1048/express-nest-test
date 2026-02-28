import { BUCKET } from '../../../upload/constants';
import {
  UPLOAD_URL,
  UPLOAD_ERROR_FALLBACK,
} from './image-upload-field.constants';

// --- Params / record helpers ---

/**
 * Read image URL(s) from record params.
 * Accepts params[path] as array or string, and params[path.0], params[path.1], …
 * for legacy form payloads.
 */
export function getUrlsFromParams(
  params: Record<string, unknown> | undefined,
  path: string,
  isMultiple: boolean,
): string[] {
  if (isMultiple) return getArrayFromParams(params, path);
  const v = params?.[path];
  return typeof v === 'string' && v ? [v] : [];
}

export function getRecordId(
  record: { params?: Record<string, unknown> } | null | undefined,
): string | undefined {
  const params = record?.params;
  return typeof params?.id === 'string' ? params.id : undefined;
}

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  if (typeof value === 'string' && value) return [value];
  return [];
}

function getArrayFromParams(
  params: Record<string, unknown> | undefined,
  path: string,
): string[] {
  if (!params) return [];
  const direct = params[path];
  if (Array.isArray(direct)) {
    return ensureStringArray(direct);
  }
  const collected: string[] = [];
  let i = 0;
  for (;;) {
    const key = `${path}.${i}`;
    const v = params[key];
    if (v === undefined || v === null) break;
    if (typeof v === 'string' && v) collected.push(v);
    i += 1;
  }
  return collected;
}

// --- Path and error helpers ---

export function buildUploadPath(
  uploadPathPrefix: string | undefined,
  recordId: string | undefined,
): string | null {
  if (!uploadPathPrefix || typeof uploadPathPrefix !== 'string') return null;
  const segment = (recordId?.trim() || '_new').replace(/[^a-zA-Z0-9_.-]/g, '');
  const prefix = uploadPathPrefix.trim().replace(/[^a-zA-Z0-9_.-]/g, '');
  return prefix ? `${prefix}/${segment}` : null;
}

export function getErrorMessage(
  err: unknown,
  fallback = UPLOAD_ERROR_FALLBACK,
): string {
  return err instanceof Error ? err.message : fallback;
}

// --- Upload (single helper) ---

async function uploadFile(
  file: File,
  uploadPath: string | null,
): Promise<string> {
  const url = new URL(UPLOAD_URL, window.location.origin);
  if (uploadPath) {
    url.searchParams.set('path', uploadPath);
  }
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(url.toString(), {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  });

  if (!res.ok) {
    const err = (await res
      .json()
      .catch(() => ({ message: res.statusText }))) as {
      message?: string;
    };
    throw new Error(err.message ?? 'Upload failed');
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

/**
 * Extract storage key from a Supabase public URL.
 * URL format: .../storage/v1/object/public/<bucket>/<key>
 */
export function getStorageKeyFromPublicUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const prefix = `/storage/v1/object/public/${BUCKET}/`;
    if (!pathname.startsWith(prefix)) return null;
    return pathname.slice(prefix.length) || null;
  } catch {
    return null;
  }
}

/**
 * Delete a file from storage by its public URL (only works for Supabase public URLs for our bucket).
 * No-op if the URL is not a valid storage URL (e.g. blob URL).
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  const key = getStorageKeyFromPublicUrl(url);
  if (!key) return;
  const deleteUrl = new URL(UPLOAD_URL, window.location.origin);
  deleteUrl.searchParams.set('path', key);
  const res = await fetch(deleteUrl.toString(), {
    method: 'DELETE',
    credentials: 'same-origin',
  });
  if (!res.ok) {
    const err = (await res
      .json()
      .catch(() => ({ message: res.statusText }))) as { message?: string };
    throw new Error(err.message ?? 'Delete failed');
  }
}

/**
 * Upload files and return the next value for the field: single URL or array of URLs appended to currentUrls.
 */
export async function uploadFilesAndBuildNextValue(
  files: FileList | File[],
  uploadPath: string | null,
  isMultiple: boolean,
  currentUrls: string[],
): Promise<string | string[]> {
  const list = Array.from(files);
  if (list.length === 0) {
    return isMultiple ? currentUrls : '';
  }
  const urls: string[] = [];
  for (let i = 0; i < list.length; i++) {
    urls.push(await uploadFile(list[i], uploadPath));
  }
  if (isMultiple) {
    return [...currentUrls, ...urls];
  }
  return urls[0];
}
