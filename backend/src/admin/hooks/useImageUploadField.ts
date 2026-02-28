import { useState } from 'react';
import {
  buildUploadPath,
  getUrlsFromParams,
  getRecordId,
  uploadFilesAndBuildNextValue,
  getErrorMessage,
  deleteFileByUrl,
} from '../utils/image-upload/image-upload-field.utils';
import { getFieldConfig } from '../utils/image-upload/image-upload-field.config';
import type { ImageUploadFieldProps } from '../types/image-upload-field.types';

export function useImageUploadField(props: ImageUploadFieldProps) {
  const { property, record, onChange } = props;

  const config = getFieldConfig(property);

  const params = record?.params;
  const recordId = getRecordId(record);
  const uploadPath = buildUploadPath(config.uploadPathPrefix, recordId);
  const urls = getUrlsFromParams(params, config.path, config.isMultiple);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const handleFiles = async (files: File[]): Promise<void> => {
    if (!files.length || !onChange) return;

    setError(null);
    setUploading(true);
    setUploadingFiles(files);
    try {
      const nextValue = await uploadFilesAndBuildNextValue(
        files,
        uploadPath,
        config.isMultiple,
        urls,
      );
      onChange(config.path, nextValue);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      setUploadingFiles([]);
    }
  };

  const removeUrl = (index: number): void => {
    if (!onChange) return;
    const urlToRemove = urls[index];
    if (urlToRemove) {
      void deleteFileByUrl(urlToRemove).catch(() => {
        // Fire-and-forget: image is removed from form either way
      });
    }
    if (config.isMultiple) {
      const next = urls.filter((_, i) => i !== index);
      onChange(config.path, next);
    } else {
      onChange(config.path, '');
    }
  };

  return {
    field: {
      path: config.path,
      isMultiple: config.isMultiple,
      urls,
      uploadingFiles,
      uploadPath,
      uploadPathPrefix: config.uploadPathPrefix,
      recordId,
      saveFirstMessage: config.saveFirstMessage,
    },
    status: { uploading, error },
    actions: { handleFiles, removeUrl },
  };
}
