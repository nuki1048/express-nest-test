import type { SupportedLocale } from './locale.types';
import type { ApartmentTranslations } from './locale.types';
import type { ApartmentVariantTranslations } from './locale.types';
import type { RentalTranslations } from './locale.types';
import type { RentalVariantTranslations } from './locale.types';
import type { BlogPostTranslations } from './locale.types';

type RentalVariantRecord = {
  title: string;
  description: string;
  viewFromWindow: string;
  translations?: unknown;
  [key: string]: unknown;
};

type RentalRecord = {
  title: string;
  viewFromWindow: string;
  translations?: unknown;
  variants?: RentalVariantRecord[];
  [key: string]: unknown;
};

type ApartmentVariantRecord = {
  viewFromWindow: string;
  translations?: unknown;
  [key: string]: unknown;
};

type ApartmentRecord = {
  title: string;
  description: string;
  translations?: unknown;
  variants?: ApartmentVariantRecord[];
  [key: string]: unknown;
};

type BlogPostRecord = {
  title: string;
  description: string;
  content: string;
  translations?: unknown;
  [key: string]: unknown;
};

function localizeVariant(
  variant: ApartmentVariantRecord,
  locale: SupportedLocale,
): ApartmentVariantRecord {
  const { translations, ...rest } = variant;
  const translationsMap = translations as Record<
    string,
    ApartmentVariantTranslations
  > | null;
  if (locale === 'en' || !translationsMap?.[locale]) {
    return rest as ApartmentVariantRecord;
  }
  const t = translationsMap[locale];
  return {
    ...rest,
    viewFromWindow: t.viewFromWindow ?? variant.viewFromWindow,
  } as ApartmentVariantRecord;
}

export function localizeApartment(
  apartment: ApartmentRecord,
  locale: SupportedLocale,
): ApartmentRecord {
  const { translations, variants, ...rest } = apartment;
  const translationsMap = translations as Record<
    string,
    ApartmentTranslations
  > | null;
  if (locale === 'en' || !translationsMap?.[locale]) {
    const result = { ...rest, variants } as ApartmentRecord;
    if (variants?.length) {
      result.variants = variants.map((v) => localizeVariant(v, locale));
    }
    return result;
  }
  const t = translationsMap[locale];
  const result = {
    ...rest,
    title: t.title ?? apartment.title,
    description: t.description ?? apartment.description,
    variants: variants?.map((v) => localizeVariant(v, locale)),
  } as ApartmentRecord;
  return result;
}

function localizeRentalVariant(
  variant: RentalVariantRecord,
  locale: SupportedLocale,
): RentalVariantRecord {
  const { translations, ...rest } = variant;
  const translationsMap = translations as Record<
    string,
    RentalVariantTranslations
  > | null;
  if (locale === 'en' || !translationsMap?.[locale]) {
    return rest as RentalVariantRecord;
  }
  const t = translationsMap[locale];
  return {
    ...rest,
    title: t.title ?? variant.title,
    description: t.description ?? variant.description,
    viewFromWindow: t.viewFromWindow ?? variant.viewFromWindow,
  } as RentalVariantRecord;
}

export function localizeRental(
  record: RentalRecord,
  locale: SupportedLocale,
): RentalRecord {
  const { translations, variants, ...rest } = record;
  const translationsMap = translations as Record<
    string,
    RentalTranslations
  > | null;
  if (locale === 'en' || !translationsMap?.[locale]) {
    const result = { ...rest, variants } as RentalRecord;
    if (variants?.length) {
      result.variants = variants.map((v) =>
        localizeRentalVariant(v, locale),
      );
    }
    return result;
  }
  const t = translationsMap[locale];
  return {
    ...rest,
    title: t.title ?? record.title,
    viewFromWindow: t.viewFromWindow ?? record.viewFromWindow,
    variants: variants?.map((v) => localizeRentalVariant(v, locale)),
  } as RentalRecord;
}

export function localizeBlogPost(
  post: BlogPostRecord,
  locale: SupportedLocale,
): BlogPostRecord {
  const { translations, ...rest } = post;
  const translationsMap = translations as Record<
    string,
    BlogPostTranslations
  > | null;
  if (locale === 'en' || !translationsMap?.[locale]) {
    return rest as BlogPostRecord;
  }
  const t = translationsMap[locale];
  return {
    ...rest,
    title: t.title ?? post.title,
    description: t.description ?? post.description,
    content: t.content ?? post.content,
  } as BlogPostRecord;
}
