import { useState } from 'react';
import { Input, Tabs } from 'antd';
import { MarkdownPreview } from '../../../components/MarkdownPreview';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export function ContentEditor({ value = '', onChange }: Props) {
  const [activeTab, setActiveTab] = useState('edit');
  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      items={[
        {
          key: 'edit',
          label: 'Edit',
          children: (
            <Input.TextArea
              rows={12}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
            />
          ),
        },
        {
          key: 'preview',
          label: 'Preview',
          children: <MarkdownPreview content={value} />,
        },
      ]}
    />
  );
}
