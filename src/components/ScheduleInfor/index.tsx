import React from 'react';
import { Card } from 'antd';
import { Booking } from '../../types';

const ScheduleInfor: React.FC<{ recentEvent: Booking }> = ({ recentEvent }) => {
    const [year, month, date] = recentEvent.date.split(`-`).map(Number);
    return (<Card title={recentEvent.class} bordered={false} style={{ padding: `10px`, marginBottom: `16px`, width: `260px`, textAlign: `start` }}>
        <p style={{ marginBottom:`0.1em`}}>{year}</p>
        <div className={`month-and-date`}>
            <p>{`${month}/${date}`}</p>
        </div>
        <p>{recentEvent.startTime} ~ {recentEvent.endTime}</p>
        <p>學生: {recentEvent.user}</p>
    </Card>);
}
export default ScheduleInfor;