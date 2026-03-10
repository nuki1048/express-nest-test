import React from 'react';
import {
  List,
  Create,
  Edit,
  useForm,
  useTable,
  EditButton,
} from '@refinedev/antd';
import { Form, Input, Table, Space } from 'antd';
import { AddressField } from '../../components/AddressField.js';
import { LinksField } from '../../components/LinksField.js';

const contactColumns = [
  { title: 'Email', dataIndex: 'email', key: 'email' },
  {
    title: 'Phone Numbers',
    dataIndex: 'phoneNumbers',
    key: 'phoneNumbers',
    render: (v: string[]) => v?.join(',') ?? '-',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: (_: unknown, record: { id?: string | number }) =>
      record?.id != null ? (
        <Space>
          <EditButton size="small" recordItemId={record.id} />
        </Space>
      ) : null,
  },
];

const ContactForm = () => (
  <>
    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
      <Input type="email" />
    </Form.Item>
    <Form.Item
      name="phoneNumbers"
      label="Phone Numbers"
      getValueFromEvent={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

export function ContactList() {
  const { tableProps } = useTable();
  return (
    <List createButtonProps={{ children: 'Create Contact' }}>
      <Table
        {...tableProps}
        columns={contactColumns}
        rowKey="id"
        pagination={false}
      />
    </List>
  );
}

export function ContactCreate() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Create title="Create Contact" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ContactForm />
      </Form>
    </Create>
  );
}

export function ContactEdit() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Edit title="Edit Contact" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ContactForm />
      </Form>
    </Edit>
  );
}
