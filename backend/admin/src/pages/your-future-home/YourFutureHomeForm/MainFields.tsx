import { Form } from 'antd';
import { RootFields } from './RootFields';
import { VariantsList } from './VariantsList';

export function MainFields() {
  return (
    <>
      <RootFields />
      <Form.Item
        label="Variants"
        required
        rules={[
          {
            validator: (_, value) =>
              Array.isArray(value) && value.length > 0
                ? Promise.resolve()
                : Promise.reject(new Error('Add at least one variant')),
          },
        ]}
      >
        <VariantsList />
      </Form.Item>
    </>
  );
}
