import { Form, Input, InputNumber, Switch } from 'antd';
import { ImageUploadField } from '../../../components/ImageUploadField';

const PATH_PREFIX = 'your-future-home';

export function RootFields() {
  return (
    <>
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="mainPhoto" label="Main Photo" rules={[{ required: true }]}>
        <ImageUploadField pathPrefix={PATH_PREFIX} />
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
      <Form.Item
        name="hasAc"
        label="Has AC"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>
    </>
  );
}
