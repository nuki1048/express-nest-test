import React from 'react';
import { Box, FormGroup, Label, Input } from '@adminjs/design-system';
import { useAddressField } from '../hooks/useAddressField';
import type { AddressFieldProps } from '../types/address-field.types';

export const AddressField: React.FC<AddressFieldProps> = (props) => {
  const { where } = props;
  const { path, address, handleChange } = useAddressField(props);

  if (where === 'edit') {
    return (
      <Box>
        <FormGroup mb="lg">
          <Label htmlFor={`${path}-label`}>Label</Label>
          <Input
            id={`${path}-label`}
            value={address.label}
            onChange={(e) =>
              handleChange('label', (e.target as HTMLInputElement).value)
            }
            placeholder="e.g. Kyiv, vul. Khreshchatyk 1"
          />
        </FormGroup>
        <FormGroup mb="lg">
          <Label htmlFor={`${path}-url`}>URL</Label>
          <Input
            id={`${path}-url`}
            value={address.url}
            onChange={(e) =>
              handleChange('url', (e.target as HTMLInputElement).value)
            }
            placeholder="https://maps.example.com/..."
          />
        </FormGroup>
      </Box>
    );
  }

  if (where === 'show' || where === 'list') {
    const hasValue = address.label || address.url;
    if (!hasValue) return null;
    return (
      <Box>
        {address.label && (
          <Box mb="default">
            <Label>Label</Label>
            <Box mt="sm">{address.label}</Box>
          </Box>
        )}
        {address.url && (
          <Box mb="default">
            <Label>URL</Label>
            <Box mt="sm">
              <a href={address.url} target="_blank" rel="noopener noreferrer">
                {address.url}
              </a>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return null;
};

export default AddressField;
