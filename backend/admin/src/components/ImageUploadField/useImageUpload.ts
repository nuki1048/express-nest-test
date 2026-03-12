import { useState, useEffect } from 'react';
import type { UploadFile, UploadProps } from 'antd';

type Props = {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  pathPrefix: string;
  multiple?: boolean;
};

export function useImageUpload({
  value,
  onChange,
  pathPrefix,
  multiple = false,
}: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const action = `/api/upload?path=${encodeURIComponent(pathPrefix + '/upload')}`;

  useEffect(() => {
    setFileList((prev) => {
      const uploading = prev.filter(
        (f) =>
          f.status !== 'done' && f.status !== 'error' && f.status !== 'removed',
      );
      if (!value && uploading.length === 0) {
        return [];
      }
      if (!value) {
        return uploading;
      }
      const urls = Array.isArray(value) ? value : [value];
      const urlItems = urls.filter(Boolean).map((url, i) => ({
        uid: `url-${i}-${url}`,
        name: (url as string).split('/').pop() ?? 'image',
        status: 'done' as const,
        url: url as string,
      }));
      return [...urlItems, ...uploading];
    });
  }, [value]);

  const handleChange: UploadProps['onChange'] = (info) => {
    const completed = [...info.fileList].filter(
      (f) => (f.response?.url || f.url) && f.status !== 'removed',
    );
    const newUrls = completed.map((f) => (f.response?.url ?? f.url) as string);

    if (info.file.status === 'done' && info.file.response?.url) {
      onChange?.(multiple ? newUrls : (newUrls[0] ?? ''));
    } else if (info.file.status === 'removed') {
      onChange?.(multiple ? newUrls : (newUrls[0] ?? ''));
    }
    setFileList(info.fileList);
  };

  return {
    fileList,
    handleChange,
    action,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    maxCount: multiple ? 20 : 1,
    multiple,
  };
}
