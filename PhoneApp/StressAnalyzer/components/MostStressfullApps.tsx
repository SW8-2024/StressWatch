import React from 'react';
import { StyleSheet } from 'react-native';
import { BarChart, barDataItem as BarDataItem } from "react-native-gifted-charts";


interface Props {
  stressByApp: StressByApp[];
  stressAverage: number;
}

const stressfulAppColor = "#9D4949";
const relaxingAppColor = "#559D49";

export default function MostStressfullApps({ stressByApp, stressAverage }: Props): JSX.Element {
  const coloredData = stressByApp.map((v, i) => ({
    value: v.value,
    label: v.name,
    frontColor: v.value > stressAverage ? stressfulAppColor : relaxingAppColor
  }));

  return (
    <BarChart
      data={coloredData}
      barWidth={30}
      yAxisColor={'white'}
      yAxisTextStyle={{ color: 'white' }}
      xAxisColor={'white'}
      xAxisLabelTextStyle={{ color: 'white' }}
      spacing={5}
      barBorderColor={'black'}
      barBorderWidth={2}
      onPress={(item: BarDataItem, index: number) => console.log('item', item)}
      labelWidth={60}
      labelsExtraHeight={50}
      width={200}
      rotateLabel
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
  );
}
