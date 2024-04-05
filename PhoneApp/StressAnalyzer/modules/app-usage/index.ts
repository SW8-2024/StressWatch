import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to AppUsage.web.ts
// and on native platforms to AppUsage.ts
import AppUsageModule from './src/AppUsageModule';
import AppUsageView from './src/AppUsageView';
import { UsageDataEvent } from './src/AppUsage.types';

export async function getUsageStatsAsync(startTime: number, endTime: number) {
  AppUsageModule.getUsageStatsAsync(startTime, endTime);
}

const emitter = new EventEmitter(AppUsageModule ?? NativeModulesProxy.AppUsage);

export function addChangeListener(listener: (event: any) => void): Subscription {
  return emitter.addListener<UsageDataEvent>('usageDataEvent', listener);
}

export { AppUsageView };
