import {
  List,
  Create,
  Edit,
  useForm,
  useTable,
  EditButton,
} from '@refinedev/antd';
import { Form, Table, Space } from 'antd';
import { ContactForm } from './ContactForm';

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
