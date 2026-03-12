import { Form } from 'antd';
import { ContentEditor } from './ContentEditor';

type Props = {
  name: string | [string, string, string];
  label?: string;
  required?: boolean;
};

export function ContentFieldWithPreview({
  name,
  label = 'Content',
  required = true,
}: Props) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true }] : undefined}
    >
      <ContentEditor />
    </Form.Item>
  );
}
