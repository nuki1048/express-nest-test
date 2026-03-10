import type { SupportedLocale } from './locale.types';
import type { ApartmentTranslations } from './locale.types';
import type { BlogPostTranslations } from './locale.types';

type ApartmentRecord = {
  title: string;
  description: string;
  viewFromWindow: string;
  translations?: unknown;
  [key: string]: unknown;
};

type BlogPostRecord = {
  title: string;
  description: string;
  content: string;
  translations?: unknown;
  [key: string]: unknown;
};

export function localizeApartment(
  apartment: ApartmentRecord,
  locale: SupportedLocale,
): ApartmentRecord {
  const { translations, ...rest } = apartment;
  const translationsMap = translations as Record<
    string,
    ApartmentTranslations
  > | null;
  if (locale === 'en' || !translationsMap?.[locale]) {
    return rest as ApartmentRecord;
  }
  const t = translationsMap[locale];
  return {
    ...rest,
    title: t.title ?? apartment.title,
    description: t.description ?? apartment.description,
    viewFromWindow: t.viewFromWindow ?? apartment.viewFromWindow,
  } as ApartmentRecord;
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
