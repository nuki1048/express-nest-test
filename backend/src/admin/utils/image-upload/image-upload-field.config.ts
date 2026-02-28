import { DEFAULT_SAVE_FIRST_MESSAGE } from './image-upload-field.constants';
import type { ImageUploadFieldProps } from '../../types/image-upload-field.types';
export type FieldConfig = {
  path: string;
  isMultiple: boolean;
  uploadPathPrefix: string | undefined;
  saveFirstMessage: string;
};

/**
 * Build field config from AdminJS property.
 * Multiple upload is enabled when path is "photos" (used for apartment photos).
 */
export function getFieldConfig(
  property: ImageUploadFieldProps['property'],
): FieldConfig {
  return {
    path: property.path,
    isMultiple: property.path === 'photos',
    uploadPathPrefix: property.custom?.uploadPathPrefix,
    saveFirstMessage:
      property.custom?.saveFirstMessage ?? DEFAULT_SAVE_FIRST_MESSAGE,
  };
}
