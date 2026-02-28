import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BUCKET } from './constants';
import type { UploadFilePayload } from './upload.types';

@Injectable()
export class UploadService {
  private client: SupabaseClient | null = null;

  private getClient(): SupabaseClient {
    if (!this.client) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) {
        throw new Error(
          'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for uploads',
        );
      }
      this.client = createClient(url, key);
    }
    return this.client;
  }

  /**
   * Upload a file buffer to Supabase Storage and return the public URL.
   * @param file - buffer, originalname, and optional mimetype
   */
  async uploadFile(
    file: UploadFilePayload,
    pathPrefix: string,
  ): Promise<string> {
    const ext = file.originalname.includes('.')
      ? file.originalname.slice(file.originalname.lastIndexOf('.'))
      : '';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    const key = `${pathPrefix}/${name}`;
    const contentType = file.mimetype ?? 'application/octet-stream';

    const { error } = await this.getClient()
      .storage.from(BUCKET)
      .upload(key, file.buffer, { contentType, upsert: true });

    if (error) throw error;

    const { data } = this.getClient().storage.from(BUCKET).getPublicUrl(key);
    return data.publicUrl;
  }

  /**
   * Delete a file from Supabase Storage by its full storage key.
   * @param storageKey - full path in the bucket, e.g. "apartments/<id>/<filename>"
   */
  async deleteFile(storageKey: string): Promise<void> {
    const { error } = await this.getClient()
      .storage.from(BUCKET)
      .remove([storageKey]);
    if (error) throw error;
  }
}
