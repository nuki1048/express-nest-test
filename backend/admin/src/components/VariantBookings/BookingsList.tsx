import { Button, List } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Booking } from '../../hooks/useVariantBookings';

type Props = {
  bookings: Booking[];
  loading: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
};

export function BookingsList({
  bookings,
  loading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <List
      size="small"
      dataSource={bookings}
      renderItem={(b) => (
        <List.Item
          actions={[
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(b)}
              loading={loading}
            />,
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(b.id)}
              loading={loading}
            />,
          ]}
        >
          <List.Item.Meta
            title={`${dayjs(b.startDate).format('MMM D, YYYY')} – ${dayjs(b.endDate).format('MMM D, YYYY')}`}
            description={b.guestName || '—'}
          />
        </List.Item>
      )}
      locale={{ emptyText: 'No bookings' }}
    />
  );
}
