import slugify from 'slugify';

type SlugDelegate = {
  findUnique: (args: { where: { slug: string } }) => Promise<unknown>;
};

export function titleToSlug(title: string): string {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
  return String(slug ?? '');
}

export async function ensureUniqueSlug(
  delegate: SlugDelegate,
  baseSlug: string,
  excludeSlug?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const existing = await delegate.findUnique({ where: { slug } });
    if (!existing) break;
    if (excludeSlug && slug === excludeSlug) break;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

/**
 * Returns slug update data when title changes. Use in update flows.
 * @returns { slug } if title is provided, otherwise {}
 */
export async function getSlugForUpdate(
  delegate: SlugDelegate,
  title: string | undefined,
  currentSlug: string,
  fallbackPrefix: string,
): Promise<{ slug?: string }> {
  if (title === undefined) return {};
  const baseSlug =
    titleToSlug(title) || `${fallbackPrefix}${Date.now().toString(36)}`;
  const slug = await ensureUniqueSlug(delegate, baseSlug, currentSlug);
  return { slug };
}
