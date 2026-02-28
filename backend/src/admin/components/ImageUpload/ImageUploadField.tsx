import React from 'react';
import { useImageUploadField } from '../../hooks/useImageUploadField';
import type { ImageUploadFieldProps } from '../../types/image-upload-field.types';
import { ImageUploadFieldEdit } from './ImageUploadFieldEdit';
import { ImageUploadFieldShow } from './ImageUploadFieldShow';

export const ImageUploadField: React.FC<ImageUploadFieldProps> = (props) => {
  const { where } = props;
  const state = useImageUploadField(props);

  if (where === 'edit') {
    return <ImageUploadFieldEdit {...state} />;
  }

  if (where === 'show' || where === 'list') {
    return <ImageUploadFieldShow urls={state.field.urls} />;
  }

  return null;
};

export default ImageUploadField;
