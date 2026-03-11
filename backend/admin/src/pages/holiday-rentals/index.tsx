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
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Table,
  Space,
  Card,
  Button,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ImageUploadField } from '../../components/ImageUploadField';
import { LocaleSwitch } from '../../components/LocaleSwitch';
import { DEFAULT_LOCALE, TRANSLATION_LOCALES } from '../../constants/locales';

type LocaleCode = (typeof TRANSLATION_LOCALES)[number]['code'] | 'en';

const columns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  {
    title: 'Bedrooms',
    key: 'bedrooms',
    width: 100,
    render: (_: unknown, record: Record<string, unknown>) =>
      (record.variants as { bedrooms?: number }[])?.[0]?.bedrooms ?? '—',
  },
  {
    title: 'Max People',
    key: 'maxPeople',
    width: 100,
    render: (_: unknown, record: Record<string, unknown>) =>
      (record.variants as { maxPeople?: number }[])?.[0]?.maxPeople ?? '—',
  },
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

const RootFields = () => (
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
    <Form.Item name="mainPhoto" label="Main Photo" rules={[{ required: true }]}>
      <ImageUploadField pathPrefix="holiday-rentals" />
    </Form.Item>
    <Form.Item name="airbnb" label="Airbnb Link">
      <Input placeholder="https://airbnb.com/..." />
    </Form.Item>
    <Form.Item name="booking" label="Booking.com Link">
      <Input placeholder="https://booking.com/..." />
    </Form.Item>
  </>
);

const VariantFields = ({ name }: { name: number }) => (
  <Card size="small" style={{ marginBottom: 16 }}>
    <Form.Item
      name={[name, 'bedrooms']}
      label="Bedrooms"
      rules={[{ required: true }]}
    >
      <InputNumber min={1} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name={[name, 'maxPeople']}
      label="Max People"
      rules={[{ required: true }]}
    >
      <InputNumber min={1} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name={[name, 'couches']}
      label="Couches"
      rules={[{ required: true }]}
    >
      <InputNumber min={0} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name={[name, 'showers']}
      label="Showers"
      rules={[{ required: true }]}
    >
      <InputNumber min={1} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name={[name, 'viewFromWindow']}
      label="View From Window"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name={[name, 'hasAc']}
      label="Has AC"
      valuePropName="checked"
      initialValue={false}
    >
      <Switch />
    </Form.Item>
    <Form.Item name={[name, 'photos']} label="Photos">
      <ImageUploadField pathPrefix="holiday-rentals" multiple />
    </Form.Item>
  </Card>
);

const VariantsList = () => (
  <Form.List name="variants">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name }) => (
          <div key={key} style={{ position: 'relative' }}>
            <VariantFields name={name} />
            <Button
              type="text"
              danger
              icon={<MinusCircleOutlined />}
              onClick={() => remove(name)}
              style={{ position: 'absolute', top: 8, right: 8 }}
            >
              Remove variant
            </Button>
          </div>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            Add variant
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

const MainFields = () => (
  <>
    <RootFields />
    <Form.Item
      label="Variants"
      required
      rules={[
        {
          validator: (_, value) =>
            Array.isArray(value) && value.length > 0
              ? Promise.resolve()
              : Promise.reject(new Error('Add at least one variant')),
        },
      ]}
    >
      <VariantsList />
    </Form.Item>
  </>
);

const TranslationFieldsForLocale = ({ locale }: { locale: string }) => (
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
  </>
);

const FormWithLocale = () => {
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
        <MainFields />
      </div>
      {TRANSLATION_LOCALES.map((l) => (
        <div
          key={l.code}
          style={{ display: activeLocale === l.code ? 'block' : 'none' }}
        >
          <TranslationFieldsForLocale locale={l.code} />
        </div>
      ))}
    </>
  );
};

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
  const { formProps, saveButtonProps } = useForm();
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <FormWithLocale />
      </Form>
    </Edit>
  );
}
