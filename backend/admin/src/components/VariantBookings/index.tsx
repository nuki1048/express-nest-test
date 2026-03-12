import { Calendar, Collapse, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useVariantBookings, type Booking } from '../../hooks/useVariantBookings';
import { MainCalendarCell } from './BookingCalendarCells';
import { BookingsList } from './BookingsList';
import { AddBookingModal } from './AddBookingModal';
import { EditBookingModal } from './EditBookingModal';

export function VariantBookings({
  variantId,
  slug,
  bookings: initialBookings,
  onBookingsChange,
}: {
  variantId: string;
  slug: string;
  bookings: Booking[];
  onBookingsChange: () => void;
}) {
  const {
    bookings,
    loading,
    accordionOpen,
    setAccordionOpen,
    addModalOpen,
    openAddModal,
    closeAddModal,
    editModalOpen,
    editingBooking,
    openEditModal,
    closeEditModal,
    dateRange,
    setDateRange,
    guestName,
    setGuestName,
    notes,
    setNotes,
    addBooking,
    updateBooking,
    deleteBooking,
    otherBookings,
  } = useVariantBookings({
    variantId,
    slug,
    bookings: initialBookings,
    onBookingsChange,
  });

  return (
    <Collapse
      size="small"
      activeKey={accordionOpen}
      onChange={(keys) => setAccordionOpen(Array.isArray(keys) ? keys : [keys])}
      items={[
        {
          key: 'bookings',
          label: 'Bookings',
          children: (
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <span />
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={openAddModal}
                  loading={loading}
                >
                  Add booking
                </Button>
              </div>
              <Calendar
                fullscreen={false}
                dateFullCellRender={(date) => (
                  <MainCalendarCell date={date} bookings={bookings} />
                )}
                style={{ marginBottom: 16 }}
              />
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Upcoming bookings
              </div>
              <BookingsList
                bookings={bookings}
                loading={loading}
                onEdit={openEditModal}
                onDelete={deleteBooking}
              />
              <AddBookingModal
                open={addModalOpen}
                loading={loading}
                dateRange={dateRange}
                guestName={guestName}
                notes={notes}
                bookings={bookings}
                onDateRangeChange={setDateRange}
                onGuestNameChange={setGuestName}
                onNotesChange={setNotes}
                onOk={addBooking}
                onCancel={closeAddModal}
              />
              <EditBookingModal
                open={editModalOpen}
                loading={loading}
                dateRange={dateRange}
                guestName={guestName}
                notes={notes}
                otherBookings={otherBookings}
                editingBooking={editingBooking}
                onDateRangeChange={setDateRange}
                onGuestNameChange={setGuestName}
                onNotesChange={setNotes}
                onOk={updateBooking}
                onCancel={closeEditModal}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
