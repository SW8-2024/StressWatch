import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to AppUsage.web.ts
// and on native platforms to AppUsage.ts
import AppUsageModule from './src/AppUsageModule';
import AppUsageView from './src/AppUsageView';
import { ChangeEventPayload, AppUsageViewProps } from './src/AppUsage.types';

// Get the native constant value.
export const PI = AppUsageModule.PI;

export function hello(): string {
  return AppUsageModule.hello();
}

export async function setValueAsync(value: string) {
  return await AppUsageModule.setValueAsync(value);
}

const emitter = new EventEmitter(AppUsageModule ?? NativeModulesProxy.AppUsage);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { AppUsageView, AppUsageViewProps, ChangeEventPayload };
