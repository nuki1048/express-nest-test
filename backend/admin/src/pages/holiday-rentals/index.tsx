import { useParams } from 'react-router-dom';
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
import { HolidayRentalFormWithLocale } from './HolidayRentalForm';
import { MainFields } from './HolidayRentalForm/MainFields';

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

export function HolidayRentalList() {
  const { tableProps } = useTable();
  return (
    <List>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
}

export function HolidayRentalCreate() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ variants: [{}] }}>
        <MainFields />
      </Form>
    </Create>
  );
}

export function HolidayRentalEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const { id } = useParams<{ id: string }>();
  const slug = id ?? queryResult?.data?.data?.slug;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <HolidayRentalFormWithLocale
          slug={slug}
          onBookingsChange={() => queryResult?.refetch()}
        />
      </Form>
    </Edit>
  );
}
