import type { ChangeEvent } from 'react';
import { Form, Input } from 'antd';
import { AddressField } from '../../components/AddressField';
import { LinksField } from '../../components/LinksField';

export function ContactForm() {
  return (
    <>
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input type="email" />
      </Form.Item>
      <Form.Item
        name="phoneNumbers"
        label="Phone Numbers"
        getValueFromEvent={(e: ChangeEvent<HTMLTextAreaElement>) => {
          const val = e.target.value;
          return val ? val.split('\n').map((s) => s.trim()) : [];
        }}
        getValueProps={(value: string[]) => ({ value: value?.join('\n') ?? '' })}
      >
        <Input.TextArea placeholder="One per line" rows={4} />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <AddressField />
      </Form.Item>
      <Form.Item name="links" label="Links">
        <LinksField />
      </Form.Item>
    </>
  );
}
