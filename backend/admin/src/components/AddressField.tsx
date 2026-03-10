import React from 'react';
import { Form, Input } from 'antd';

interface AddressValue {
  label?: string;
  url?: string;
}

interface AddressFieldProps {
  value?: AddressValue;
  onChange?: (value: AddressValue) => void;
}

export function AddressField({ value, onChange }: AddressFieldProps) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Form.Item label="Label" style={{ flex: 1, minWidth: 120 }}>
        <Input
          value={value?.label ?? ''}
          onChange={(e) => onChange?.({ ...value, label: e.target.value })}
          placeholder="Address label"
        />
      </Form.Item>
      <Form.Item label="URL" style={{ flex: 1, minWidth: 200 }}>
        <Input
          value={value?.url ?? ''}
          onChange={(e) => onChange?.({ ...value, url: e.target.value })}
          placeholder="https://..."
        />
      </Form.Item>
    </div>
  );
}
