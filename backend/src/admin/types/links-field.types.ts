export const LINK_KEYS = [
  'facebook',
  'instagram',
  'airbnb',
  'booking',
] as const;
export type LinkKey = (typeof LINK_KEYS)[number];

export type LinksValue = Partial<Record<LinkKey, string>>;

export type LinksFieldProps = {
  property: { path: string };
  record?: { params?: Record<string, unknown> } | null;
  onChange?: (path: string, value: unknown) => void;
  where: 'show' | 'list' | 'edit' | 'filter';
};
