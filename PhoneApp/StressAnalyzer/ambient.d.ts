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
        referenceStress: number;
    }

    interface RemoteBreakDownData {
        averageStress: number;
        dailyStressDataPoints: (Omit<StressDataPoint, 'date'> & { date: string })[];
        stressByApp: StressByApp[];
    }

    interface RemoteAppUsageAnalysis {
        name: string;
        averageStress: number;
        referenceStress: number;
        usage: string;
    }

    interface RemoteAppAnalysisData {
        appUsageAnalysis: RemoteAppUsageAnalysis[]
    }

    interface AppAnalysisByDateData {
        date: Date;
        averageStress: number;
        referenceStress: number;
        usageHours: number;
        usageMinutes: number;
        usageSeconds: number;
    }

    interface RemoteAppAnalysisByDateData {
        appUsageForAppAndDays: RemoteAppAnalysisByDate[];
    }

    interface RemoteAppAnalysisByDate {
        dateTime: string;
        dayReferenceStress: number;
        dayAverageStress: number;
        totalUsage: string;
    }

    interface GraphDataForAppAndDate {
        value : number,
        frontColor : ColorValue,
        label : string,
        capColor : ColorValue,
    }

    interface RemoteGraphDataForAppAndDate {
        averageStress: number;
        dateTime: string;
        appOpen: boolean;
    }

    interface AppAnalysisByDayAndApp {
        startTime: Date;
        averageStress: number;
        referenceStress: number;
        usageHours: number;
        usageMinutes: number;
        usageSeconds: number;
    }

    interface RemoteAppAnalysisByDayAndApp {
        appUsageStart: string;
        averageStress: number;
        referenceStress: number;
        usage: string;
    }

    interface RemoteAnalysisForDayAndAppResponse {
        highResolutionStress: RemoteGraphDataForAppAndDate[];
        appUsageAnalysis: RemoteAppAnalysisByDayAndApp[];
    }
}
