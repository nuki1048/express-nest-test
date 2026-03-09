import { Form, Input, Space } from 'antd';
import React from 'react';
interface LinksValue {
  facebook?: string;
  instagram?: string;
  airbnb?: string;
  booking?: string;
  whatsapp?: string;
}

const LINK_KEYS: (keyof LinksValue)[] = [
  'facebook',
  'instagram',
  'airbnb',
  'booking',
  'whatsapp',
];

interface LinksFieldProps {
  value?: LinksValue;
  onChange?: (value: LinksValue) => void;
}

export function LinksField({ value = {}, onChange }: LinksFieldProps) {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {LINK_KEYS.map((key) => (
        <Form.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
          <Input
            value={value[key] ?? ''}
            onChange={(e) =>
              onChange?.({ ...value, [key]: e.target.value || undefined })
            }
            placeholder={`https://${key}.com/...`}
          />
        </Form.Item>
      ))}
    </Space>
  );
}
