import React, { useState } from 'react';
import { Box, Button, Text, Loader } from '@adminjs/design-system';
import { THUMB_SIZE } from '../../utils/image-upload/image-upload-field.constants';

type ImageUploadThumbnailProps = {
  url: string;
  variant: 'edit' | 'show';
  index: number;
  onRemove?: (index: number) => void;
};

const CARD_STYLE = {
  width: THUMB_SIZE,
  overflow: 'hidden' as const,
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  backgroundColor: '#f5f5f5',
};

const IMG_CONTAINER_STYLE = {
  width: THUMB_SIZE,
  height: THUMB_SIZE,
  display: 'block',
};

const IMG_STYLE = {
  width: THUMB_SIZE,
  height: THUMB_SIZE,
  objectFit: 'cover' as const,
  display: 'block',
};

type ThumbnailOverlayStatus = 'loading' | 'loaded' | 'error';

function ThumbnailOverlay({ status }: { status: ThumbnailOverlayStatus }) {
  if (status === 'loaded') return null;
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="default"
      backgroundColor="grey20"
    >
      {status === 'loading' && <Loader />}
      {status === 'error' && (
        <Text fontSize="sm" color="error">
          Failed to load
        </Text>
      )}
    </Box>
  );
}

export const ImageUploadThumbnail: React.FC<ImageUploadThumbnailProps> = ({
  url,
  variant,
  index,
  onRemove,
}) => {
  const [status, setStatus] = useState<ThumbnailOverlayStatus>('loading');

  const img = (
    <img
      src={url}
      alt=""
      style={IMG_STYLE}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
    />
  );

  const imageLink = (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', lineHeight: 0 }}
    >
      {img}
    </a>
  );

  return (
    <Box style={CARD_STYLE}>
      <Box position="relative" style={IMG_CONTAINER_STYLE}>
        {imageLink}
        <ThumbnailOverlay status={status} />
      </Box>
      {variant === 'edit' && onRemove && (
        <Box padding="sm">
          <Button
            size="sm"
            variant="danger"
            onClick={() => onRemove(index)}
            style={{ width: '100%' }}
          >
            Remove
          </Button>
        </Box>
      )}
    </Box>
  );
};
