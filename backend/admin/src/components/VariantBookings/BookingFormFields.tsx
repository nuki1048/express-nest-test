import type { ReactNode } from 'react';
import { Calendar, DatePicker, Input } from 'antd';
import type { Dayjs } from 'dayjs';

type Props = {
  dateRange: [Dayjs | null, Dayjs | null];
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null]) => void;
  guestName: string;
  onGuestNameChange: (v: string) => void;
  notes: string;
  onNotesChange: (v: string) => void;
  disabledDate: (date: Dayjs) => boolean;
  calendarCellRender: (date: Dayjs) => ReactNode;
};

export function BookingFormFields({
  dateRange,
  onDateRangeChange,
  guestName,
  onGuestNameChange,
  notes,
  onNotesChange,
  disabledDate,
  calendarCellRender,
}: Props) {
  const { RangePicker } = DatePicker;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Date range *</label>
        <RangePicker
          value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] : null}
          onChange={(dates) =>
            onDateRangeChange(
              dates ? [dates[0] ?? null, dates[1] ?? null] : [null, null],
            )
          }
          disabledDate={disabledDate}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8 }}>Availability</label>
        <Calendar
          fullscreen={false}
          dateFullCellRender={(date) => calendarCellRender(date)}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Guest name (optional)
        </label>
        <Input
          value={guestName}
          onChange={(e) => onGuestNameChange(e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Notes (optional)
        </label>
        <Input.TextArea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g. Airbnb #12345"
          rows={2}
        />
      </div>
    </div>
  );
}
