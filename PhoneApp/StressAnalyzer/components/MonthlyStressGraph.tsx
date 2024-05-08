import { StressDataPoint } from '@/helpers/Database';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart, barDataItem as BarDataItem } from "react-native-gifted-charts";

const valueToColor = (value: number): string => {
  if (value < 44) {
    return '#36890E'
  }
  else if (value < 60) {
    return '#CFA613'
  }
  else if (value < 80) {
    return '#AF2C03'
  }
  else {
    return '#AF0303'
  }
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  month: '2-digit'
});

interface Props {
  dataPoints: StressDataPoint[];
  stressAverage: number;
}

export default function MonthlyStressGraph({ dataPoints, stressAverage }: Props): JSX.Element {
  const coloredData = dataPoints.map((v, i) => ({
    value: v.value,
    label: ((i % 5) == 0) ? dateFormatter.format(v.date) : undefined,
    frontColor: valueToColor(v.value),
    originalDate: v.date
  }));

  return (
    <View style={{ overflow: 'hidden', marginRight: 10 }}>
      <BarChart
        data={coloredData}
        barWidth={8}
        yAxisColor={'white'}
        yAxisTextStyle={{ color: 'white' }}
        xAxisColor={'white'}
        xAxisLabelTextStyle={{ color: 'white' }}
        xAxisLabelsVerticalShift={6}
        spacing={2}
        onPress={(item: BarDataItem, index: number) => console.log('item', item)}
        labelWidth={40}
        showReferenceLine1
        referenceLine1Position={stressAverage}
        referenceLine1Config={{
          color: 'white',
          labelText: 'average',
          labelTextStyle: {
            color: 'white'
          },
          dashWidth: 6,
          dashGap: 4,
          thickness: 3
        }} />
    </View>
  );
}
