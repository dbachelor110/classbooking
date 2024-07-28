type TimeRange = {
    startTime: { hour: number, minute: number },
    endTime: { hour: number, minute: number }
};
type CronObject = {
    timeRanges: TimeRange[],
    dayOfMonth: number[],
    month: number[],
    dayOfWeek: number[],
    [key: string]: number[] | TimeRange[]
};
type DateKeys = `dayOfMonth` | `month` | `dayOfWeek`;
const parseRange = (value: string, valueMaker: (tempTimeStringSplit: string[]) => any[]) => {
    // console.log(`In parseRange: ${value}`);
    const tempValue = [];
    const tempTimeStrings = value.split(`,`);
    for (let TimeString of tempTimeStrings) {
        if (TimeString == `*`) break;
        const tempTimeStringSplit = TimeString.split(`-`);
        tempValue.push(...valueMaker(tempTimeStringSplit));
    }
    return tempValue;
}
const parseDate = (inputDate: Date | string) => {
    if (typeof inputDate == `string`) {
        inputDate = new Date(inputDate);
    }
    return inputDate;
}

const timeStringToNumber = (timeString:string)=>{
    const timePair = timeString.split(`:`).map(Number);
    return timePair[0]*60 + timePair[1];
}

const cron = (dateRange: string = `* * *`, timeRange: string = `09:00-17:00`) => {
    `以小時為單位`
    const cronArry = dateRange.split(` `);
    const cronInput = {
        timeRanges: timeRange,
        dayOfMonth: cronArry[0],
        month: cronArry[1],
        dayOfWeek: cronArry[2],
    }
    const croner: CronObject = {
        timeRanges: [],
        dayOfMonth: [],
        month: [],
        dayOfWeek: [],
    };
    for (const [key, value] of Object.entries(cronInput)) {
        parseRange
        if (key == `timeRanges`) {
            croner[key] = parseRange(value, (tempTimeStringSplit) => {
                // console.log(tempTimeStringSplit);
                const startTime = tempTimeStringSplit[0].split(`:`);
                const endTime = tempTimeStringSplit[1].split(`:`);
                return [{
                    startTime: { hour: parseInt(startTime[0]), minute: parseInt(startTime[1]) },
                    endTime: { hour: parseInt(endTime[0]), minute: parseInt(endTime[1]) }
                }];
            });
        }
        else {
            croner[key] = parseRange(value, (tempTimeStringSplit) => {
                const tempValue = [];
                const timePair: number[] = tempTimeStringSplit.reduce(
                    (p: number[], c: string) => {
                        p.push(parseInt(c));
                        return p;
                    },
                    [],
                );
                if (timePair.length < 2) timePair.push(timePair[0]);
                for (let TimeStringUnit = timePair[0]; TimeStringUnit <= timePair[1]; TimeStringUnit++) {
                    tempValue.push(TimeStringUnit);
                }
                return tempValue;
            });
        }
    }
    const checkCroner = (checkTimeNumber: number, timeType: DateKeys) => {
        if (croner[timeType].length == 0) return true;
        const tempIndex = croner[timeType].findIndex((element)=>element==checkTimeNumber);
        if (timeType != `month`){
            console.log(`Check Croner, Type: ${timeType}(${checkTimeNumber}), Croner: ${croner[timeType]}`);
        }
        
        return tempIndex != -1;
    }
    const isInDateRanges = (inputDate: Date) => {
        if (!checkCroner(inputDate.getMonth(), `month`)) return [false, `month`];

        // 只要符合其中一邊，兩邊都 false 才 false
        if (croner.dayOfMonth.length !=0 && croner.dayOfWeek.length !=0) {
            if (!checkCroner(inputDate.getDate(), `dayOfMonth`) && !checkCroner(inputDate.getDay(), `dayOfWeek`)) return [false, `day`];
        }
        // 需要符合兩邊，一邊 false 就 false
        if (!checkCroner(inputDate.getDate(), `dayOfMonth`) || !checkCroner(inputDate.getDay(), `dayOfWeek`)) return [false, `day`];
        return [true, ``];
    }
    const isInTimeRanges = (checkingDate: Date) => {
        if (!croner.timeRanges) return true;
        const year = checkingDate.getFullYear();
        const month = checkingDate.getMonth();
        const day = checkingDate.getDate();
        for (let i = 0; i < croner.timeRanges.length; i++) {
            const timeRange = croner.timeRanges[i];
            const start = new Date(year, month, day, timeRange.startTime.hour, timeRange.startTime.minute);
            const end = new Date(year, month, day, timeRange.endTime.hour, timeRange.endTime.minute);
            if (checkingDate >= start && checkingDate <= end) {
                return true;
            }
        }
        return false;
    }
    const isInCron = (inputDate: Date | string) => {
        inputDate = parseDate(inputDate);
        const [InDateRanges] = isInDateRanges(inputDate);
        if (!InDateRanges) return false;
        return isInTimeRanges(inputDate);
    }
    const getRange = (inputDate: Date | string) => {
        inputDate = parseDate(inputDate);
        const [InDateRanges,type] = isInDateRanges(inputDate);
        console.log(`getRange: ${inputDate.toLocaleDateString('en-CA')}=>[${InDateRanges}, ${type}]`);
        // 日期不符，回傳空陣列
        if (!InDateRanges) return [];
        const outputArray = [];
        // if (!croner.timeRanges) return true;
        const year = inputDate.getFullYear();
        const month = inputDate.getMonth();
        const day = inputDate.getDate();
        for (let i = 0; i < croner.timeRanges.length; i++) {
            const timeRange = croner.timeRanges[i];
            const start = new Date(year, month, day, timeRange.startTime.hour, timeRange.startTime.minute);
            const end = new Date(year, month, day, timeRange.endTime.hour, timeRange.endTime.minute);
            outputArray.push({ startTime: start, endTime: end });
        }
        return outputArray;
    }
    return { isInCron: isInCron, getRange: getRange };
}
export { cron, timeStringToNumber };