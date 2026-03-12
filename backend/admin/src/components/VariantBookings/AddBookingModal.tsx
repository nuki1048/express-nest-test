import { Modal } from 'antd';
import { isDateInBookings, type Booking } from '../../hooks/useVariantBookings';
import { BookingFormFields } from './BookingFormFields';
import { AddModalCalendarCell } from './BookingCalendarCells';
import type { Dayjs } from 'dayjs';

type Props = {
  open: boolean;
  loading: boolean;
  dateRange: [Dayjs | null, Dayjs | null];
  guestName: string;
  notes: string;
  bookings: Booking[];
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null]) => void;
  onGuestNameChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onOk: () => void;
  onCancel: () => void;
};

export function AddBookingModal({
  open,
  loading,
  dateRange,
  guestName,
  notes,
  bookings,
  onDateRangeChange,
  onGuestNameChange,
  onNotesChange,
  onOk,
  onCancel,
}: Props) {
  return (
    <Modal
      title="Add booking"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Add"
      destroyOnClose
      confirmLoading={loading}
    >
      <BookingFormFields
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        guestName={guestName}
        onGuestNameChange={onGuestNameChange}
        notes={notes}
        onNotesChange={onNotesChange}
        disabledDate={(date) => isDateInBookings(date, bookings)}
        calendarCellRender={(date) => (
          <AddModalCalendarCell date={date} bookings={bookings} />
        )}
      />
    </Modal>
  );
}
