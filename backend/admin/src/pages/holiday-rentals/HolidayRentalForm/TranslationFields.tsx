import { Form, Input } from 'antd';

type Props = {
  locale: string;
  variants?: { title?: string }[];
};

export function TranslationFieldsForLocale({ locale, variants }: Props) {
  return (
    <>
      <Form.Item name={['translations', locale, 'title']} label="Title">
        <Input />
      </Form.Item>
      <Form.Item
        name={['translations', locale, 'viewFromWindow']}
        label="View From Window"
      >
        <Input />
      </Form.Item>
      {(variants ?? []).map((v, idx) => {
        const variantLabel = v?.title?.trim() || `Variant ${idx + 1}`;
        return (
          <div key={idx} style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{variantLabel}</div>
            <Form.Item
              name={['variants', idx, 'translations', locale, 'title']}
              label="Title"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['variants', idx, 'translations', locale, 'description']}
              label="Description"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name={['variants', idx, 'translations', locale, 'viewFromWindow']}
              label="View From Window"
            >
              <Input />
            </Form.Item>
          </div>
        );
      })}
    </>
  );
}
