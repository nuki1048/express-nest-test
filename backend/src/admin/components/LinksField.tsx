import React from 'react';
import { Box } from '@adminjs/design-system';
import { useLinksField } from '../hooks/useLinksField';
import { LinkItemEdit, LinkItemShow } from './LinkItem/LinkItem';
import { LINK_KEYS, LinksFieldProps } from '../types/links-field.types';

export const LinksField: React.FC<LinksFieldProps> = (props) => {
  const { where } = props;
  const { path, links, handleChange } = useLinksField(props);

  if (where === 'edit') {
    return (
      <Box>
        {LINK_KEYS.map((key) => (
          <LinkItemEdit
            key={key}
            path={path}
            linkKey={key}
            value={links[key] ?? ''}
            onChange={handleChange}
          />
        ))}
      </Box>
    );
  }

  if (where === 'show' || where === 'list') {
    const filled = LINK_KEYS.filter((k) => links[k]);
    if (filled.length === 0) return null;
    return (
      <Box>
        {filled.map((key) => (
          <LinkItemShow key={key} linkKey={key} value={links[key] ?? ''} />
        ))}
      </Box>
    );
  }

  return null;
};

export default LinksField;
