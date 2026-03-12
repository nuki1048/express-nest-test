export const SUPPORTED_LOCALES = ['en', 'it', 'ru'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export type ApartmentTranslations = {
  title?: string;
  description?: string;
};

export type ApartmentVariantTranslations = {
  viewFromWindow?: string;
};

export type RentalTranslations = {
  title?: string;
  viewFromWindow?: string;
};

export type RentalVariantTranslations = {
  title?: string;
  description?: string;
  viewFromWindow?: string;
};

export type BlogPostTranslations = {
  title?: string;
  description?: string;
  content?: string;
};
