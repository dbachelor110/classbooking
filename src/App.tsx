// src/App.tsx
import React, { useState } from 'react';
import CalendarComponent from './components/Calendar';
import useSchedule from './hooks/useSchedule';

const App: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const { schedule } = useSchedule(date);

  return (
    <div>
      <CalendarComponent date={date} onChange={setDate} events={schedule} />
    </div>
  );
};

export default App;