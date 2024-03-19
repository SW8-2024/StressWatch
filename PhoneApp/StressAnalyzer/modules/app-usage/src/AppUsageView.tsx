import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { AppUsageViewProps } from './AppUsage.types';

const NativeView: React.ComponentType<AppUsageViewProps> =
  requireNativeViewManager('AppUsage');

export default function AppUsageView(props: AppUsageViewProps) {
  return <NativeView {...props} />;
}
