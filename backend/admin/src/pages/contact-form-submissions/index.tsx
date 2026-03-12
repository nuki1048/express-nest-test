import { List, Show, ShowButton, useTable } from '@refinedev/antd';
import { Table, Space } from 'antd';
import { ShowContent } from './ShowContent';

const columns = [
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (v: string) => (v ? new Date(v).toLocaleString() : '-'),
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: (_: unknown, record: { id?: string | number }) =>
      record?.id != null ? (
        <Space>
          <ShowButton size="small" recordItemId={record.id} />
        </Space>
      ) : null,
  },
];

export function ContactFormSubmissionList() {
  const { tableProps } = useTable();
  return (
    <List>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
}

export function ContactFormSubmissionShow() {
  return (
    <Show>
      <ShowContent />
    </Show>
  );
}
