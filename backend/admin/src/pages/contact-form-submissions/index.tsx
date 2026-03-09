import { useShow } from '@refinedev/core';
import { List, Show, useTable } from '@refinedev/antd';
import { Table, Descriptions } from 'antd';

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
];

export function ContactFormSubmissionList() {
  const { tableProps } = useTable();
  return (
    <List>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
}

function ShowContent() {
  const { queryResult } = useShow();
  const record = queryResult?.data?.data;
  if (!record) return null;
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="First Name">
        {record.firstName}
      </Descriptions.Item>
      <Descriptions.Item label="Last Name">{record.lastName}</Descriptions.Item>
      <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{record.phoneNumber}</Descriptions.Item>
      <Descriptions.Item label="Message">{record.message}</Descriptions.Item>
      <Descriptions.Item label="Created">
        {record.createdAt ? new Date(record.createdAt).toLocaleString() : '-'}
      </Descriptions.Item>
    </Descriptions>
  );
}

export function ContactFormSubmissionShow() {
  return (
    <Show>
      <ShowContent />
    </Show>
  );
}
