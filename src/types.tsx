export type TimeRange = {
    startDate: string;
    endDate: string;
    dateRange:string;
    timeRange:string;
}

export type ClassInfo = {
    name: string;
    teacher: string;
    [key:string]:any;
}

export type ClassData = {
    [key: string]: ClassInfo;
}

export type Booking = {
    class: string;
    user: string;
    date:string;
    startTime:string;
    endTime:string;
}