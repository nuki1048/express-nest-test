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
import { BlogPostFormWithLocale } from './BlogPostForm';
import { BlogPostMainFields } from './BlogPostForm/MainFields';

const blogPostColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  { title: 'Read Time', dataIndex: 'readTime', key: 'readTime', width: 100 },
  {
    title: 'Published',
    dataIndex: 'isPublished',
    key: 'isPublished',
    render: (v: boolean) => (v ? 'Yes' : 'No'),
  },
  { title: 'Views', dataIndex: 'views', key: 'views', width: 80 },
  { title: 'Likes', dataIndex: 'likes', key: 'likes', width: 80 },
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

export function BlogPostList() {
  const { tableProps } = useTable();
  return (
    <List>
      <Table {...tableProps} columns={blogPostColumns} rowKey="id" />
    </List>
  );
}

export function BlogPostCreate() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <BlogPostMainFields />
      </Form>
    </Create>
  );
}

export function BlogPostEdit() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <BlogPostFormWithLocale />
      </Form>
    </Edit>
  );
}
