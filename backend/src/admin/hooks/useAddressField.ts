import { getAddressFromParams } from '../utils/address-field.utils';
import type { AddressFieldProps, ContactAddressValue } from '../types/address-field.types';

export function useAddressField(props: AddressFieldProps) {
  const { property, record, onChange } = props;
  const path = property.path;
  const params = record?.params;
  const address = getAddressFromParams(params, path);

  const handleChange = (field: keyof ContactAddressValue, value: string): void => {
    if (!onChange) return;
    onChange(path, { ...address, [field]: value });
  };

  return { path, address, handleChange };
}
