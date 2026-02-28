import React from 'react';
import { Box } from '@adminjs/design-system';
import { THUMB_GRID_STYLE } from '../../utils/image-upload/image-upload-field.constants';
import { ImageUploadThumbnail } from './ImageUploadThumbnail';

type ImageUploadFieldShowProps = {
  urls: string[];
};

export const ImageUploadFieldShow: React.FC<ImageUploadFieldShowProps> = ({
  urls,
}) => {
  if (urls.length === 0) return null;

  return (
    <Box style={THUMB_GRID_STYLE}>
      {urls.map((url, i) => (
        <ImageUploadThumbnail key={url} url={url} variant="show" index={i} />
      ))}
    </Box>
  );
};
