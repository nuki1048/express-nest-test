import React from 'react';
import { Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

interface ImageUploadFieldProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  pathPrefix: string;
  multiple?: boolean;
}

export function ImageUploadField({
  value,
  onChange,
  pathPrefix,
  multiple = false,
}: ImageUploadFieldProps) {
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

  return (
    <Upload.Dragger
      name="file"
      action={action}
      listType="picture"
      fileList={fileList}
      onChange={handleChange}
      headers={token ? { Authorization: `Bearer ${token}` } : {}}
      maxCount={multiple ? 20 : 1}
      multiple={multiple}
      accept="image/*"
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag image to upload</p>
    </Upload.Dragger>
  );
}
