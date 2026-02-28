import { useEffect, useState } from 'react';

/**
 * Returns object URLs for the given files and revokes them on cleanup.
 * Use for previewing File objects before upload.
 */
export function useObjectUrls(files: File[]): string[] {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (files.length === 0) {
      setUrls([]);
      return;
    }
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  return urls;
}
