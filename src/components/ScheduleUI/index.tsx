// src/ScheduleUI.tsx
import React, { useState } from 'react';
import CalendarComponent from '../Calendar';
import useSchedule from '../../hooks/useSchedule';

const ScheduleUI: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const { schedule } = useSchedule(date);

  return (
    <div>
      <CalendarComponent date={date} onChange={setDate} events={schedule} />
    </div>
  );
};

export default ScheduleUI;