/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Box, FormGroup, Label, Input } from '@adminjs/design-system';

type LinksFieldProps = {
  property: { path: string };
  record?: { params?: Record<string, unknown> } | null;
  onChange?: (path: string, value: unknown) => void;
  where: 'show' | 'list' | 'edit' | 'filter';
};

const LINK_KEYS = ['facebook', 'instagram', 'airbnb', 'booking'] as const;
const LABELS: Record<(typeof LINK_KEYS)[number], string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  airbnb: 'Airbnb',
  booking: 'Booking.com',
};

type LinksValue = Partial<Record<(typeof LINK_KEYS)[number], string>>;

function parseLinks(value: unknown): LinksValue {
  if (value == null) return {};
  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return LINK_KEYS.reduce<LinksValue>((acc, key) => {
      const v = obj[key];
      acc[key] = typeof v === 'string' ? v : '';
      return acc;
    }, {});
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      return parseLinks(parsed);
    } catch {
      return {};
    }
  }
  return {};
}

/** Get links from record.params: supports both nested (params.links) and flattened (params['links.facebook']) */
function getLinksFromParams(
  params: Record<string, unknown> | undefined,
  path: string,
): LinksValue {
  if (!params) return {};
  const nested = params[path];
  if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
    return parseLinks(nested);
  }
  const prefix = `${path}.`;
  const flattened = LINK_KEYS.reduce<LinksValue>((acc, key) => {
    const v = params[`${prefix}${key}`];
    acc[key] = typeof v === 'string' ? v : '';
    return acc;
  }, {});
  return flattened;
}

const LinksField: React.FC<LinksFieldProps> = (props) => {
  const { property, record, onChange, where } = props;
  const isEdit = where === 'edit';
  const path = property.path as string;
  const params = record?.params as Record<string, unknown> | undefined;
  const links = getLinksFromParams(params, path);

  const handleChange = (key: (typeof LINK_KEYS)[number], value: string) => {
    if (!onChange) return;
    const next = { ...links, [key]: value };
    onChange(path, next);
  };

  if (isEdit) {
    return (
      <Box>
        {LINK_KEYS.map((key) => (
          <FormGroup key={key} mb="lg">
            <Label htmlFor={`${path}-${key}`}>{LABELS[key]}</Label>
            <Input
              id={`${path}-${key}`}
              value={links[key] ?? ''}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                handleChange(key, target.value);
              }}
              placeholder={`https://${key}.com/...`}
            />
          </FormGroup>
        ))}
      </Box>
    );
  }

  // show / list
  const filled = LINK_KEYS.filter((k) => links[k]);
  if (filled.length === 0) return null;
  return (
    <Box>
      {filled.map((key) => (
        <Box key={key} mb="default">
          <Label>{LABELS[key]}</Label>
          <Box mt="sm">
            <a href={links[key]} target="_blank" rel="noopener noreferrer">
              {links[key]}
            </a>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default LinksField;
