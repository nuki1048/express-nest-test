export const DEFAULT_LOCALE = {
  code: 'en',
  label: 'English (Default)',
} as const;

export const TRANSLATION_LOCALES = [
  { code: 'it', label: 'Italian' },
  { code: 'ru', label: 'Russian' },
] as const;

export const ALL_LOCALES = [DEFAULT_LOCALE, ...TRANSLATION_LOCALES] as const;
