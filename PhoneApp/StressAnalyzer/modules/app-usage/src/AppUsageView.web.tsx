import * as React from 'react';

import { AppUsageViewProps } from './AppUsage.types';

export default function AppUsageView(props: AppUsageViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
