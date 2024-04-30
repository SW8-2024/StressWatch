import  * as moduleTypes from "@/modules/app-usage/src/AppUsage.types";

declare global {
    type EventUsageRawData = {
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

    type EventUsageTransformedData = {
        from: DateTime;
        to: DateTime;
        sessions : Session[],
        appName : string,
    }

    type Session = {
        from : DateTime,
        to : dateTime,         
    }
   
    type UsageDataEvent = moduleTypes.UsageDataEvent;
}
