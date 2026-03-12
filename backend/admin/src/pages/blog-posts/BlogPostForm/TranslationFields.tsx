import { Form, Input } from 'antd';
import { ContentFieldWithPreview } from './ContentFieldWithPreview';

type Props = {
  locale: string;
};

export function BlogPostTranslationFieldsForLocale({ locale }: Props) {
  return (
    <>
      <Form.Item name={['translations', locale, 'title']} label="Title">
        <Input />
      </Form.Item>
      <Form.Item
        name={['translations', locale, 'description']}
        label="Description"
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <ContentFieldWithPreview
        name={['translations', locale, 'content']}
        required={false}
      />
    </>
  );
}
