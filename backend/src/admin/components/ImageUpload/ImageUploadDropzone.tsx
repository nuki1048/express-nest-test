import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text } from '@adminjs/design-system';
import { IMAGE_ACCEPT_MAP } from '../../utils/image-upload/image-upload-field.constants';
type ImageUploadDropzoneProps = {
  multiple: boolean;
  disabled: boolean;
  onDropAccepted: (files: File[]) => void;
};

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  multiple,
  disabled,
  onDropAccepted,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: IMAGE_ACCEPT_MAP,
    multiple,
    disabled,
    onDropAccepted: (acceptedFiles) => void onDropAccepted(acceptedFiles),
    noClick: false,
    noKeyboard: false,
  });

  const hint = isDragActive
    ? 'Drop the images here...'
    : 'Drag & drop images here, or click to select';

  return (
    <Box
      {...getRootProps()}
      padding="default"
      border="default"
      borderRadius="default"
      backgroundColor={isDragActive ? 'grey20' : 'white'}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderStyle: 'dashed',
        marginBottom: 8,
      }}
    >
      <input {...getInputProps()} />
      <Text fontSize="sm" color="grey60">
        {hint}
      </Text>
    </Box>
  );
};
