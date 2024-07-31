// src/hooks/useSchedule.tsx
import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { cron, timeStringToNumber } from '../lib/cron';
import { Event, User, CronRange, EnableTimeRange, Schedule } from '../types';
import dataM from '../lib/dataM';

type PreSchedule = {
    [date: string]: {
        enables: Event[],
        bookings: Event[]
    };
};

type UserID = `ID01`;
const TIMEFOMAT: [string, Intl.DateTimeFormatOptions] = ['en-CA',
    { hour: '2-digit', minute: '2-digit', hour12: false }];
const useSchedule = (month: Date, userID: UserID = `ID01`) => {
    const [schedule, setSchedule] = useState<Schedule>({});
    const generateSchedule = () => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        const days = eachDayOfInterval({ start, end });
        // 預設取到依日期與時間排序的資料
        const bookings = dataM.getBookingData();
        const users = dataM.getUsersData();
        const user: User = users[userID];
        // 預設取到依日期與時間排序的資料
        const enableTimeRanges: EnableTimeRange[] = user.enableTimes ? user.enableTimes : [];
        const defaultEnableTime: CronRange = user.defaultEnableTimes ? user.defaultEnableTimes : {
            dateRange: "* * 8",
            timeRange: "9:00-17:00"
        };
        const newSchedule: Schedule = {};
        const preSchedule: PreSchedule = {};
        // 取得開放預約時間清單
        days.forEach(day => {
            const dateKey = day.toLocaleDateString('en-CA');
            preSchedule[dateKey] = { enables: [], bookings: [] };
            let inRangeFlag = false;
            for (const ranges of enableTimeRanges) {
                const startDate = new Date(`${ranges.startDate} 00:00`);
                const endDate = new Date(`${ranges.endDate} 00:00`);
                console.log(`Make Cron: { start: ${startDate}, end: ${endDate}, date: ${day}`);
                console.log(`day >= startDate: ${day >= startDate}`);
                console.log(`day <= endDate  : ${day <= endDate}`);
                if (day >= startDate && day <= endDate) {
                    inRangeFlag = true;
                    const rangeArray = cron(ranges.dateRange, ranges.timeRange).getRange(day);
                    const temp = rangeArray.reduce((p: Event[], c: { startTime: Date, endTime: Date }) => {
                        p.push({ startTime: c.startTime.toLocaleTimeString(...TIMEFOMAT), endTime: c.endTime.toLocaleTimeString(...TIMEFOMAT) });
                        return p;
                    }, [])
                    preSchedule[dateKey].enables.push(...temp);
                }
            }
            if (!inRangeFlag) {
                const rangeArray = cron(defaultEnableTime.dateRange, defaultEnableTime.timeRange).getRange(day);
                console.log(`get default Enable ranges`);
                console.log(rangeArray);
                const temp = rangeArray.reduce((p: Event[], c: { startTime: Date, endTime: Date }) => {
                    p.push({ startTime: c.startTime.toLocaleTimeString(...TIMEFOMAT), endTime: c.endTime.toLocaleTimeString(...TIMEFOMAT) });
                    return p;
                }, []);
                preSchedule[dateKey].enables.push(...temp);
            }
        });
        // 取得預約清單
        bookings.forEach((booking) => {
            const { date, ...tempEvent } = booking;
            if (preSchedule[date]) {
                preSchedule[date].bookings.push(tempEvent);
            }
        });
        // 開放預約減去已預約，組合清單
        days.forEach(day => {
            const dateKey = day.toLocaleDateString('en-CA');
            const { enables, bookings } = preSchedule[dateKey];
            const outputEvents: Event[] = [];
            if (enables.length == 0) {
                const bookingsAddType: Event[] = bookings.map((booking) => ({ ...booking, type: `booking` }));
                outputEvents.push(...bookingsAddType);
            } else {
                const sortEventGroup: Event[][] = enables.map((enable) => [enable]);
                let currentEnableID = 0;
                for (const booking of bookings) {
                    console.log(`Grouping`);
                    console.log(`enable: `);
                    console.log(enables[currentEnableID]);
                    console.log(`booking: `);
                    console.log(booking);
                    while (timeStringToNumber(enables[currentEnableID].startTime) < timeStringToNumber(booking.startTime)) {
                        currentEnableID += 1;
                    }
                    sortEventGroup[currentEnableID].push(booking);
                }
                for (const group of sortEventGroup) {
                    const enable = group.shift();
                    if (group.length == 0 && enable) {
                        outputEvents.push({ ...enable, type: `enable` });
                    }
                    else {
                        let { ...currentEnable } = enable;
                        // 迭代減去 booking 的時間，並將 enable 與 booking 加入輸出事件陣列
                        for (const booking of group) {
                            if (timeStringToNumber(booking.startTime) < timeStringToNumber(currentEnable.startTime)) {
                                outputEvents.push({ ...currentEnable, endTime: booking.startTime, type: `enable` });
                                outputEvents.push({ ...booking, type: `booking` });
                                currentEnable.startTime = booking.endTime;
                            }
                            else {
                                outputEvents.push({ ...booking, type: `booking` });
                                currentEnable.startTime = booking.endTime;
                            }
                        }
                        // 如果還有剩 enable 時間，加入輸出事件陣列\
                        console.log(`判斷是否還有剩 enable 時間:`);
                        console.info(currentEnable);
                        if (currentEnable.startTime != currentEnable.endTime) {
                            outputEvents.push({ ...currentEnable, type: `enable` });
                        }
                    }
                }
            }
            newSchedule[dateKey] = outputEvents;
        });
        setSchedule(newSchedule);
    };
    useEffect(() => {
        generateSchedule();
    }, [month]);
    return { schedule };
};
export default useSchedule;