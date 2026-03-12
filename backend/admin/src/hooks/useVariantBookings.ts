import { useState, useEffect } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { message } from 'antd';

const API_URL = '/api';

export type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  guestName?: string | null;
  notes?: string | null;
};

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function isDateInBookings(date: Dayjs, bookings: Booking[]): boolean {
  return bookings.some(
    (b) =>
      !date.isBefore(dayjs(b.startDate), 'day') &&
      !date.isAfter(dayjs(b.endDate), 'day'),
  );
}

export function useVariantBookings({
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
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [accordionOpen, setAccordionOpen] = useState<string[]>(['bookings']);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [guestName, setGuestName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const hasOverlap = (start: Dayjs, end: Dayjs, excludeId?: string) =>
    bookings.some(
      (b) =>
        b.id !== excludeId &&
        !end.isBefore(dayjs(b.startDate), 'day') &&
        !start.isAfter(dayjs(b.endDate), 'day'),
    );

  const openAddModal = () => {
    setDateRange([null, null]);
    setGuestName('');
    setNotes('');
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setDateRange([null, null]);
    setGuestName('');
    setNotes('');
  };

  const openEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setDateRange([dayjs(booking.startDate), dayjs(booking.endDate)]);
    setGuestName(booking.guestName ?? '');
    setNotes(booking.notes ?? '');
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingBooking(null);
    setDateRange([null, null]);
    setGuestName('');
    setNotes('');
  };

  const addBooking = async () => {
    const [start, end] = dateRange;
    if (!start || !end) {
      message.error('Please select date range');
      return;
    }
    if (end.isBefore(start)) {
      message.error('End date must be after start date');
      return;
    }
    if (hasOverlap(start, end, undefined)) {
      message.error('These dates overlap with an existing booking');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/holiday-rentals/${encodeURIComponent(slug)}/bookings`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            holidayRentalVariantId: variantId,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            guestName: guestName || undefined,
            notes: notes || undefined,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to add booking');
      }
      const created = await res.json();
      setBookings((prev) => [...prev, created]);
      onBookingsChange();
      closeAddModal();
      message.success('Booking added');
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to add booking');
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async () => {
    if (!editingBooking) return;
    const [start, end] = dateRange;
    if (!start || !end) {
      message.error('Please select date range');
      return;
    }
    if (end.isBefore(start)) {
      message.error('End date must be after start date');
      return;
    }
    if (hasOverlap(start, end, editingBooking.id)) {
      message.error('These dates overlap with an existing booking');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/holiday-rentals/${encodeURIComponent(slug)}/bookings/${editingBooking.id}`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            guestName: guestName || undefined,
            notes: notes || undefined,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update booking');
      }
      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === editingBooking.id ? updated : b)),
      );
      onBookingsChange();
      closeEditModal();
      message.success('Booking updated');
    } catch (e) {
      message.error(
        e instanceof Error ? e.message : 'Failed to update booking',
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/holiday-rentals/${encodeURIComponent(slug)}/bookings/${bookingId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        },
      );
      if (!res.ok) throw new Error('Failed to delete booking');
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      onBookingsChange();
      message.success('Booking removed');
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const sortedBookings = [...bookings].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const otherBookings = editingBooking
    ? bookings.filter((b) => b.id !== editingBooking.id)
    : bookings;

  return {
    bookings: sortedBookings,
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
  };
}
