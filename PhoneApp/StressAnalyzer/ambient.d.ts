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
        latestDateTime: string;
    }

    interface AppAnalysisData {
        name: string;
        averageStress: number;
        referenceStress: string;
        usageHours: number;
        usageMinutes: number;
        usageSeconds: number;
    }

    interface RemoteBreakDownData {
        averageStress: number;
        dailyStressDataPoints: (Omit<StressDataPoint, 'date'> & { date: string })[];
        stressByApp: StressByApp[];
    }

    interface RemoteAppUsageAnalysis {
        name: string;
        averageStress: number;
        referenceStress: string;
        usage: string;
    }

    interface RemoteAppAnalysisData {
        appUsageAnalysis: RemoteAppUsageAnalysis[]
    }

}
