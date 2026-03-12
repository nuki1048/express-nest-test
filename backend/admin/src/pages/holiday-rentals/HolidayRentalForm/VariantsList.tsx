import { Form, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { VariantFields } from './VariantFields';

type Props = {
  slug?: string;
  onBookingsChange?: () => void;
};

export function VariantsList({ slug, onBookingsChange }: Props) {
  return (
    <Form.List name="variants">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }) => (
            <div key={key} style={{ position: 'relative' }}>
              <VariantFields
                name={name}
                slug={slug}
                onBookingsChange={onBookingsChange}
              />
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
}
