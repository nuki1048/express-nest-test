import type { Dayjs } from 'dayjs';
import { isDateInBookings, type Booking } from '../../hooks/useVariantBookings';

const cellStyle = {
  height: '100%' as const,
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  borderRadius: 4,
};

export function MainCalendarCell({
  date,
  bookings,
}: {
  date: Dayjs;
  bookings: Booking[];
}) {
  const booked = isDateInBookings(date, bookings);
  return (
    <div style={{ ...cellStyle, background: booked ? '#ffccc7' : undefined }}>
      {date.date()}
    </div>
  );
}

export function AddModalCalendarCell({
  date,
  bookings,
}: {
  date: Dayjs;
  bookings: Booking[];
}) {
  const booked = isDateInBookings(date, bookings);
  return (
    <div
      style={{
        ...cellStyle,
        background: booked ? '#ffccc7' : undefined,
        opacity: booked ? 0.8 : 1,
      }}
    >
      {date.date()}
    </div>
  );
}

export function EditModalCalendarCell({
  date,
  otherBookings,
  editingBooking,
}: {
  date: Dayjs;
  otherBookings: Booking[];
  editingBooking: Booking | null;
}) {
  const isCurrentBooking = editingBooking
    ? isDateInBookings(date, [editingBooking])
    : false;
  const isOtherBooked = isDateInBookings(date, otherBookings);
  const bg = isOtherBooked ? '#ffccc7' : isCurrentBooking ? '#d6e4ff' : undefined;
  return (
    <div style={{ ...cellStyle, background: bg, opacity: bg ? 0.9 : 1 }}>
      {date.date()}
    </div>
  );
}
