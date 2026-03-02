/**
 * Converts a title string to a URL-friendly slug.
 * e.g. "Sea View app" -> "sea-view-app"
 */
export function titleToSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
