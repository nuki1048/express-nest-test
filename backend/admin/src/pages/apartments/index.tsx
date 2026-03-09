import React, { useState } from 'react';
import {
  List,
  Create,
  Edit,
  useForm,
  useTable,
  EditButton,
  DeleteButton,
} from '@refinedev/antd';
import { Form, Input, InputNumber, Switch, Table, Space } from 'antd';
import { ImageUploadField } from '../../components/ImageUploadField';
import { LocaleSwitch } from '../../components/LocaleSwitch';
import { DEFAULT_LOCALE, TRANSLATION_LOCALES } from '../../constants/locales';

type LocaleCode = (typeof TRANSLATION_LOCALES)[number]['code'] | 'en';

const apartmentColumns = [
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

const ApartmentMainFields = () => (
  <>
    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: true }]}
    >
      <Input.TextArea rows={4} />
    </Form.Item>
    <Form.Item name="bedrooms" label="Bedrooms" rules={[{ required: true }]}>
      <InputNumber min={1} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item name="maxPeople" label="Max People" rules={[{ required: true }]}>
      <InputNumber min={1} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item name="couches" label="Couches" rules={[{ required: true }]}>
      <InputNumber min={0} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item name="showers" label="Showers" rules={[{ required: true }]}>
      <InputNumber min={1} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name="viewFromWindow"
      label="View From Window"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item name="hasAc" label="Has AC" valuePropName="checked">
      <Switch />
    </Form.Item>
    <Form.Item name="mainPhoto" label="Main Photo" rules={[{ required: true }]}>
      <ImageUploadField pathPrefix="apartments" />
    </Form.Item>
    <Form.Item name="photos" label="Photos">
      <ImageUploadField pathPrefix="apartments" multiple />
    </Form.Item>
  </>
);

const ApartmentTranslationFieldsForLocale = ({
  locale,
}: {
  locale: string;
}) => (
  <>
    <Form.Item name={['translations', locale, 'title']} label="Title">
      <Input />
    </Form.Item>
    <Form.Item
      name={['translations', locale, 'description']}
      label="Description"
    >
      <Input.TextArea rows={4} />
    </Form.Item>
    <Form.Item
      name={['translations', locale, 'viewFromWindow']}
      label="View From Window"
    >
      <Input />
    </Form.Item>
  </>
);

const ApartmentFormWithLocale = () => {
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
        <ApartmentMainFields />
      </div>
      {TRANSLATION_LOCALES.map((l) => (
        <div
          key={l.code}
          style={{ display: activeLocale === l.code ? 'block' : 'none' }}
        >
          <ApartmentTranslationFieldsForLocale locale={l.code} />
        </div>
      ))}
    </>
  );
};

const ApartmentForm = () => <ApartmentMainFields />;

export function ApartmentList() {
  const { tableProps } = useTable();
  return (
    <List>
      <Table {...tableProps} columns={apartmentColumns} rowKey="id" />
    </List>
  );
}

export function ApartmentCreate() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ApartmentForm />
      </Form>
    </Create>
  );
}

export function ApartmentEdit() {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ApartmentFormWithLocale />
      </Form>
    </Edit>
  );
}
