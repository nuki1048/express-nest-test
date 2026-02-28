import type { LinkKey, LinksValue } from '../types/links-field.types';
import { LINK_KEYS } from '../types/links-field.types';

export const LABELS: Record<LinkKey, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  airbnb: 'Airbnb',
  booking: 'Booking.com',
};

export function parseLinks(value: unknown): LinksValue {
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

/** Get links from record.params: supports nested (params.links) or flattened (params['links.facebook']). */
export function getLinksFromParams(
  params: Record<string, unknown> | undefined,
  path: string,
): LinksValue {
  if (!params) return {};
  const nested = params[path];
  if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
    return parseLinks(nested);
  }
  const prefix = `${path}.`;
  return LINK_KEYS.reduce<LinksValue>((acc, key) => {
    const v = params[`${prefix}${key}`];
    acc[key] = typeof v === 'string' ? v : '';
    return acc;
  }, {});
}
