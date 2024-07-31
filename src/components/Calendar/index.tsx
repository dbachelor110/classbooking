// src/components/Calendar.tsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Event } from '../../types';
import './Calendar.css';

type CalendarProps = {
  date: Date;
  onChange: (date: Date) => void;
  events: { [date: string]: Event[] };
}

const getEventStyle = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const top = (start / 1440) * 100; // 1440 = minutes in one day 60*24 
  const height = ((end - start) / 1440) * 100;
  return { top: `${top}%`, height: `${height}%` };
};

const CalendarComponent: React.FC<CalendarProps> = ({ date, onChange, events }) => {
  const CalendarInputDate = date;
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      // 'en-CA' => format('YYYY-MM-DD')
      const dateKey = date.toLocaleDateString('en-CA');

      const dayEvents = events[dateKey] || [];
      return (
        <div className={`day-cell${CalendarInputDate.getMonth() != date.getMonth()? ` disable`:``}`}>
          {dayEvents.map((event, index) => {
            return <div
              key={index}
              className={`event-block ${event.type == `booking` ? `booking` : `enable`}`}
              style={getEventStyle(event.startTime, event.endTime)}
              title={`${event.type == `booking` ? event.class : `${event.startTime}-${event.endTime}`}`}
            >
              <ul hidden>
                <li className='class'>{event.class}</li>
                <li className='startTime'>{event.startTime}</li>
                <li className='endTime'>{event.endTime}</li>
              </ul>
            </div>
          }
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Calendar
      onActiveStartDateChange={({ activeStartDate }) => activeStartDate && onChange(activeStartDate)}
      // onChange={()=>{}}
      // value={date}
      calendarType={`gregory`}
      showFixedNumberOfWeeks={true}
      tileContent={tileContent}
    />
  );
};

export default CalendarComponent;