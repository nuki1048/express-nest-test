import { Modal } from 'antd';
import { isDateInBookings, type Booking } from '../../hooks/useVariantBookings';
import { BookingFormFields } from './BookingFormFields';
import { EditModalCalendarCell } from './BookingCalendarCells';
import type { Dayjs } from 'dayjs';

type Props = {
  open: boolean;
  loading: boolean;
  dateRange: [Dayjs | null, Dayjs | null];
  guestName: string;
  notes: string;
  otherBookings: Booking[];
  editingBooking: Booking | null;
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null]) => void;
  onGuestNameChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onOk: () => void;
  onCancel: () => void;
};

export function EditBookingModal({
  open,
  loading,
  dateRange,
  guestName,
  notes,
  otherBookings,
  editingBooking,
  onDateRangeChange,
  onGuestNameChange,
  onNotesChange,
  onOk,
  onCancel,
}: Props) {
  return (
    <Modal
      title="Edit booking"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
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
        disabledDate={(date) => isDateInBookings(date, otherBookings)}
        calendarCellRender={(date) => (
          <EditModalCalendarCell
            date={date}
            otherBookings={otherBookings}
            editingBooking={editingBooking}
          />
        )}
      />
    </Modal>
  );
}
