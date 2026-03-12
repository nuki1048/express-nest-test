import { Form, Input, InputNumber, Switch, Card } from 'antd';
import { ImageUploadField } from '../../../components/ImageUploadField';
import { VariantBookings } from '../../../components/VariantBookings';

const PATH_PREFIX = 'holiday-rentals';

type Props = {
  name: number;
  slug?: string;
  onBookingsChange?: () => void;
};

export function VariantFields({
  name,
  slug,
  onBookingsChange,
}: Props) {
  const variantId = Form.useWatch(['variants', name, 'id']);
  const bookings = Form.useWatch(['variants', name, 'bookings']) ?? [];

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form.Item
        name={[name, 'title']}
        label="Title"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={[name, 'description']}
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name={[name, 'airbnb']} label="Airbnb Link">
        <Input placeholder="https://airbnb.com/..." />
      </Form.Item>
      <Form.Item name={[name, 'booking']} label="Booking.com Link">
        <Input placeholder="https://booking.com/..." />
      </Form.Item>
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
        <ImageUploadField pathPrefix={PATH_PREFIX} multiple />
      </Form.Item>
      {slug && variantId && (
        <div style={{ marginTop: 16 }}>
          <VariantBookings
            variantId={variantId}
            slug={slug}
            bookings={bookings}
            onBookingsChange={onBookingsChange ?? (() => {})}
          />
        </div>
      )}
    </Card>
  );
}
