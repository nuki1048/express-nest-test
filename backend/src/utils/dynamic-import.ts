/**
 * Dynamically import ESM packages from a context that may otherwise use require.
 * Use this for AdminJS and its adapters so they are not converted to require().
 * On Vercel, adminjs must be loaded via admin-vercel.module (static imports); the old admin.module must not run.
 */
export const dynamicImport = async <T = unknown>(
  packageName: string,
): Promise<T> => {
  if (
    process.env.VERCEL &&
    (packageName === 'adminjs' || packageName.startsWith('@adminjs/'))
  ) {
    throw new Error(
      `[Vercel] dynamicImport('${packageName}') is not allowed. Use admin-vercel.module (static imports) instead.`,
    );
  }
  return import(/* webpackIgnore: true */ packageName) as Promise<T>;
};
