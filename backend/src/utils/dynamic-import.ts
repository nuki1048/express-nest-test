/**
 * Dynamically import ESM packages from a context that may otherwise use require.
 * Use this for AdminJS and its adapters so they are not converted to require().
 */
export const dynamicImport = async <T = unknown>(
  packageName: string,
): Promise<T> =>
  new Function(`return import('${packageName}')`)() as Promise<T>;
