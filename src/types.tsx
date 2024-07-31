export type CronRange = {
    dateRange: string;
    timeRange: string;
}

export type TimeRange = {
    startDate: string;
    endDate: string;
};

export type EnableTimeRange = TimeRange & CronRange;


export type Event = {
    startTime: string;
    endTime: string;
    type?: `enable` | `booking`;
    [key: string]: string | undefined;
};

export type ClassInfo = {
    name: string;
    teacher: string;
    [key: string]: any;
};

export type ClassData = {
    [key: string]: ClassInfo;
};

export type Booking = Event & {
    class: string;
    user: string;
    date: string;
};

export type User = {
    name: string,
    teacher: boolean,
    defaultEnableTimes?: CronRange,
    enableTimes?: EnableTimeRange[]
};

export type Schedule = {
    [date: string]: Event[];
};