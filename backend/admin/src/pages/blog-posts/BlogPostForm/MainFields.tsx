import { Form, Input, Switch } from 'antd';
import { ImageUploadField } from '../../../components/ImageUploadField';
import { ContentFieldWithPreview } from './ContentFieldWithPreview';

const PATH_PREFIX = 'blog-post';

export function BlogPostMainFields() {
  return (
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
      <ContentFieldWithPreview name="content" />
      <Form.Item name="mainPhoto" label="Main Photo" rules={[{ required: true }]}>
        <ImageUploadField pathPrefix={PATH_PREFIX} />
      </Form.Item>
      <Form.Item name="readTime" label="Read Time (e.g. 5 min)">
        <Input placeholder="e.g. 5 min" />
      </Form.Item>
      <Form.Item name="isPublished" label="Published" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
}
