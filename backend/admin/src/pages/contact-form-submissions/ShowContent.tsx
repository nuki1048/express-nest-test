import { useShow } from '@refinedev/core';
import { Descriptions } from 'antd';

export function ShowContent() {
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
