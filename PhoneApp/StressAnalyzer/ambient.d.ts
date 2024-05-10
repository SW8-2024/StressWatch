import * as moduleTypes from "@/modules/app-usage/src/AppUsage.types";

declare global {
    interface EventUsageRawData {
        success: boolean,
        packageTimes: EventUsage[],
        queryStart: number,
        queryEnd: number,
    }

    interface EventUsage {
        packageName: string,
        startTimes: number[],
        endTimes: number[],
    }

    interface EventUsageTransformedData {
        from: DateTime;
        to: DateTime;
        sessions: Session[],
        appName: string,
    }

    interface Session {
        from: DateTime,
        to: dateTime,
    }

    interface AppUsageResponse {
        id: number,
        appName: string,
        from: DateTime,
        to: DateTime,
    }
    type UsageDataEvent = moduleTypes.UsageDataEvent;

    interface StressByApp {
        name: string;
        value: number;
    }

    interface StressDataPoint {
        date: Date;
        value: number;
    }

    interface BreakDownData {
        averageStress: number;
        dailyStressDataPoints: StressDataPoint[];
        stressByApp: StressByApp[];
    }
    
    interface StressMetrics {
        average: number;
        min: number;
        max: number;
        latest: number;
    }

}
