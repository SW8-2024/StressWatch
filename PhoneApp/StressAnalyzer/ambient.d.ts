import  * as hello from "@/modules/app-usage/src/AppUsage.types";

declare global {
    type UsageData = {
        name: string,
        foregroundTime: number,
        start: number,
        end: number
    }
    
    type AppUsage = [string, number];

    //packageName, startTimes, endTimes, query start, query end
    // type EventUsage = [[string, number[], number[]],number,number];

    type EventUsageData = {
        success: boolean,
        packageTimes: EventUsage[],
        queryStart: number,
        queryEnd: number,
    }

    type EventUsage = {
        packageName: string,
        startTimes: number[],
        endTimes: number[],
    }

    type UsageDataEvent = hello.UsageDataEvent;
}
