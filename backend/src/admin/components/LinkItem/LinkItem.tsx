import React from 'react';
import { Box, FormGroup, Label, Input } from '@adminjs/design-system';
import { LABELS } from '../../utils/links-field.utils';
import type { LinkKey } from '../../types/links-field.types';

type LinkItemEditProps = {
  path: string;
  linkKey: LinkKey;
  value: string;
  onChange: (key: LinkKey, value: string) => void;
};

type LinkItemShowProps = {
  linkKey: LinkKey;
  value: string;
};

export function LinkItemEdit({
  path,
  linkKey,
  value,
  onChange,
}: LinkItemEditProps): React.ReactElement {
  const id = `${path}-${linkKey}`;
  return (
    <FormGroup mb="lg">
      <Label htmlFor={id}>{LABELS[linkKey]}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) =>
          onChange(linkKey, (e.target as HTMLInputElement).value)
        }
        placeholder={`https://${linkKey}.com/...`}
      />
    </FormGroup>
  );
}

export function LinkItemShow({
  linkKey,
  value,
}: LinkItemShowProps): React.ReactElement {
  return (
    <Box mb="default">
      <Label>{LABELS[linkKey]}</Label>
      <Box mt="sm">
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      </Box>
    </Box>
  );
}
