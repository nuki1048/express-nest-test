export type ContactAddressValue = {
  label: string;
  url: string;
};

export type AddressFieldProps = {
  property: { path: string };
  record?: { params?: Record<string, unknown> } | null;
  onChange?: (path: string, value: unknown) => void;
  where: 'show' | 'list' | 'edit' | 'filter';
};
