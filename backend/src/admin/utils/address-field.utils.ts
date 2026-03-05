import type { ContactAddressValue } from '../types/address-field.types';

const DEFAULT_ADDRESS: ContactAddressValue = { label: '', url: '' };

export function parseAddress(value: unknown): ContactAddressValue {
  if (value == null) return { ...DEFAULT_ADDRESS };
  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return {
      label: typeof obj.label === 'string' ? obj.label : '',
      url: typeof obj.url === 'string' ? obj.url : '',
    };
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      return parseAddress(parsed);
    } catch {
      return { ...DEFAULT_ADDRESS };
    }
  }
  return { ...DEFAULT_ADDRESS };
}

/** Get address from record.params: supports nested or flattened keys. */
export function getAddressFromParams(
  params: Record<string, unknown> | undefined,
  path: string,
): ContactAddressValue {
  if (!params) return { ...DEFAULT_ADDRESS };
  const nested = params[path];
  if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
    return parseAddress(nested);
  }
  return {
    label: typeof params[`${path}.label`] === 'string' ? (params[`${path}.label`] as string) : '',
    url: typeof params[`${path}.url`] === 'string' ? (params[`${path}.url`] as string) : '',
  };
}
