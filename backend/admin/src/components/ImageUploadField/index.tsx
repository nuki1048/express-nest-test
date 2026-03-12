import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useImageUpload } from './useImageUpload';

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
  const {
    fileList,
    handleChange,
    action,
    headers,
    maxCount,
    multiple: multipleProp,
  } = useImageUpload({ value, onChange, pathPrefix, multiple });

  return (
    <Upload.Dragger
      name="file"
      action={action}
      listType="picture"
      fileList={fileList}
      onChange={handleChange}
      headers={headers}
      maxCount={maxCount}
      multiple={multipleProp}
      accept="image/*"
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag image to upload</p>
    </Upload.Dragger>
  );
}
