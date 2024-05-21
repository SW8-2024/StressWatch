import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart, barDataItem as BarDataItem } from "react-native-gifted-charts";
import { AppIcon } from './AppIcon';


interface Props {
  stressByApp: StressByApp[];
  stressAverage: number;
}

const stressfulAppColor = "#9D4949";
const relaxingAppColor = "#559D49";

export default function MostStressfullApps({ stressByApp, stressAverage }: Props): JSX.Element {
  const coloredData = stressByApp.map((v, i) => ({
    value: v.value,
    labelComponent: () => (<AppIcon packageName={v.name}/>),
    frontColor: v.value > stressAverage ? stressfulAppColor : relaxingAppColor,
    label: v.name,
  }));

  return (
    <View style={{ overflow: 'hidden', marginRight: 10 }}>
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
        disablePress={true}
        labelWidth={60}
        labelsExtraHeight={50}
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
