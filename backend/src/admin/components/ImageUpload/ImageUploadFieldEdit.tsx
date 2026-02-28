import React from 'react';
import { Box, FormGroup, Label, Text, Loader } from '@adminjs/design-system';
import {
  LABELS,
  THUMB_GRID_STYLE,
} from '../../utils/image-upload/image-upload-field.constants';
import type { ImageUploadFieldState } from '../../types/image-upload-field.types';
import { useObjectUrls } from '../../hooks/useObjectUrls';
import { ImageUploadDropzone } from './ImageUploadDropzone';
import { ImageUploadPreviewStrip } from './ImageUploadPreviewStrip';
import { ImageUploadThumbnail } from './ImageUploadThumbnail';

type ImageUploadFieldEditProps = ImageUploadFieldState;

export const ImageUploadFieldEdit: React.FC<ImageUploadFieldEditProps> = ({
  field,
  status,
  actions,
}) => {
  const previewUrls = useObjectUrls(field.uploadingFiles);
  const label = field.isMultiple ? LABELS.photos : LABELS.mainPhoto;
  const dropzoneDisabled = status.uploading || !field.uploadPath;

  return (
    <Box>
      <FormGroup>
        <Label>{label}</Label>
        {field.uploadPathPrefix && !field.recordId && (
          <Text fontSize="sm" color="grey60" mb="sm">
            {field.saveFirstMessage}
          </Text>
        )}
        <ImageUploadDropzone
          multiple={field.isMultiple}
          disabled={dropzoneDisabled}
          onDropAccepted={(files) => void actions.handleFiles(files)}
        />
        {status.uploading && <Loader />}
        {status.error && <Text color="error">{status.error}</Text>}
      </FormGroup>

      <ImageUploadPreviewStrip previewUrls={previewUrls} />

      {field.urls.length > 0 && (
        <Box mt="default" style={THUMB_GRID_STYLE}>
          {field.urls.map((url, i) => (
            <ImageUploadThumbnail
              key={url}
              url={url}
              variant="edit"
              index={i}
              onRemove={actions.removeUrl}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
