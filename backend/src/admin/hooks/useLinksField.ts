import { getLinksFromParams } from '../utils/links-field.utils';
import type { LinksFieldProps } from '../types/links-field.types';
import type { LinkKey } from '../types/links-field.types';

export function useLinksField(props: LinksFieldProps) {
  const { property, record, onChange } = props;
  const path = property.path;
  const params = record?.params;
  const links = getLinksFromParams(params, path);

  const handleChange = (key: LinkKey, value: string): void => {
    if (!onChange) return;
    onChange(path, { ...links, [key]: value });
  };

  return { path, links, handleChange };
}
