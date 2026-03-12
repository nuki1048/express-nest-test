import {
  List,
  Create,
  Edit,
  useForm,
  useTable,
  EditButton,
  DeleteButton,
} from '@refinedev/antd';
import { Form, Table, Space } from 'antd';
import { YourFutureHomeFormWithLocale } from './YourFutureHomeForm';
import { MainFields } from './YourFutureHomeForm/MainFields';

const columns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Bedrooms', dataIndex: 'bedrooms', key: 'bedrooms', width: 100 },
  { title: 'Max People', dataIndex: 'maxPeople', key: 'maxPeople', width: 100 },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: (_: unknown, record: { id?: string | number }) =>
      record?.id != null ? (
        <Space>
          <EditButton size="small" recordItemId={record.id} />
          <DeleteButton size="small" recordItemId={record.id} />
        </Space>
      ) : null,
  },
];

export function YourFutureHomeList() {
  const { tableProps } = useTable();
  return (
    <List>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
}

export function YourFutureHomeCreate() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ variants: [{}] }}>
        <MainFields />
      </Form>
    </Create>
  );
}

export function YourFutureHomeEdit() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <YourFutureHomeFormWithLocale />
      </Form>
    </Edit>
  );
}
