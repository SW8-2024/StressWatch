import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to AppUsage.web.ts
// and on native platforms to AppUsage.ts
import AppUsageModule from './src/AppUsageModule';
import { UsageDataEvent } from './src/AppUsage.types';

export async function getUsageStatsAsync(startTime: number, endTime: number) {
  return AppUsageModule.getUsageStatsAsync(startTime, endTime);
}

export async function getEventStatsInInterval(startTime: number, endTime: number) {
  return AppUsageModule.getEventStatsInInterval(startTime, endTime)
}

export function getAppIcon(packageName: string) {
  return AppUsageModule.getAppIcon(packageName);
}

const emitter = new EventEmitter(AppUsageModule ?? NativeModulesProxy.AppUsage);
//There is no typechecking that the event conforms to the given type
export function addUsageDataListener(listener: (event: UsageDataEvent) => void): Subscription {
  return emitter.addListener<UsageDataEvent>('usageDataEvent', listener);
}
