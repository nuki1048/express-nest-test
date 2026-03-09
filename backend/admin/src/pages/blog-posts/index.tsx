import { useState } from 'react';
import {
  List,
  Create,
  Edit,
  useForm,
  useTable,
  EditButton,
  DeleteButton,
} from '@refinedev/antd';
import { Form, Input, Switch, Table, Space } from 'antd';
import { ImageUploadField } from '../../components/ImageUploadField';
import { LocaleSwitch } from '../../components/LocaleSwitch';
import { DEFAULT_LOCALE, TRANSLATION_LOCALES } from '../../constants/locales';

type LocaleCode = (typeof TRANSLATION_LOCALES)[number]['code'] | 'en';

const blogPostColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
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
    render: (_, record: { id: string }) => (
      <Space>
        <EditButton size="small" recordItemId={record.id} />
        <DeleteButton size="small" recordItemId={record.id} />
      </Space>
    ),
  },
];

const BlogPostMainFields = () => (
  <>
    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: true }]}
    >
      <Input.TextArea rows={3} />
    </Form.Item>
    <Form.Item name="content" label="Content" rules={[{ required: true }]}>
      <Input.TextArea rows={12} />
    </Form.Item>
    <Form.Item name="mainPhoto" label="Main Photo" rules={[{ required: true }]}>
      <ImageUploadField pathPrefix="blog-post" />
    </Form.Item>
    <Form.Item name="isPublished" label="Published" valuePropName="checked">
      <Switch />
    </Form.Item>
  </>
);

const BlogPostTranslationFieldsForLocale = ({ locale }: { locale: string }) => (
  <>
    <Form.Item name={['translations', locale, 'title']} label="Title">
      <Input />
    </Form.Item>
    <Form.Item
      name={['translations', locale, 'description']}
      label="Description"
    >
      <Input.TextArea rows={3} />
    </Form.Item>
    <Form.Item name={['translations', locale, 'content']} label="Content">
      <Input.TextArea rows={12} />
    </Form.Item>
  </>
);

const BlogPostFormWithLocale = () => {
  const [activeLocale, setActiveLocale] = useState<LocaleCode>(
    DEFAULT_LOCALE.code,
  );

  return (
    <>
      <Form.Item label="Edit language" style={{ marginBottom: 16 }}>
        <LocaleSwitch
          value={activeLocale}
          onChange={(v) => setActiveLocale(v)}
        />
      </Form.Item>
      <div style={{ display: activeLocale === 'en' ? 'block' : 'none' }}>
        <BlogPostMainFields />
      </div>
      {TRANSLATION_LOCALES.map((l) => (
        <div
          key={l.code}
          style={{ display: activeLocale === l.code ? 'block' : 'none' }}
        >
          <BlogPostTranslationFieldsForLocale locale={l.code} />
        </div>
      ))}
    </>
  );
};

const BlogPostForm = () => <BlogPostMainFields />;

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
        <BlogPostForm />
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
