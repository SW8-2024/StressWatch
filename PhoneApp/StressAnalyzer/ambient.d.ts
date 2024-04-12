import  * as moduleTypes from "@/modules/app-usage/src/AppUsage.types";

declare global {
    type UsageData = {
        name: string,
        foregroundTime: number,
        start: number,
        end: number
    }
    
    type UsageDataPerApp = [string, number];

    type EventUsageRawData = {
        success: boolean,
        packageTimes: EventUsage[],
        queryStart: number,
        queryEnd: number,
    }

    type EventUsageTransformedData = {
        name : string,
        sessions : Session[],
        timeSpent : number
    }

    type Session = {
        start : number,
        end : number, 
        length : number
    }
    type EventUsage = {
        packageName: string,
        startTimes: number[],
        endTimes: number[],
    }

    type UsageDataEvent = moduleTypes.UsageDataEvent;
}
