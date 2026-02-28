import React from 'react';
import { Box, Loader } from '@adminjs/design-system';
import { UPLOADING_PREVIEW_STYLE } from '../../utils/image-upload/image-upload-field.constants';

type ImageUploadPreviewStripProps = {
  previewUrls: string[];
};

export const ImageUploadPreviewStrip: React.FC<
  ImageUploadPreviewStripProps
> = ({ previewUrls }) => {
  if (previewUrls.length === 0) return null;

  return (
    <Box mt="default" display="flex" flexWrap="wrap" gap="default">
      {previewUrls.map((url) => (
        <Box
          key={url}
          position="relative"
          mb="sm"
          display="flex"
          alignItems="center"
          gap="default"
        >
          <img src={url} alt="" style={UPLOADING_PREVIEW_STYLE} />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(255,255,255,0.7)"
          >
            <Loader />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
