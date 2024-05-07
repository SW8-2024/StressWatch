import { FlatList, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { View } from "@/components/Themed";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { BarChart, barDataItem } from "react-native-gifted-charts";

const dataToColoredData = (data:barDataItem[]) : barDataItem[] => {
  var coloredData:barDataItem[] = data
  coloredData = coloredData.map(item => {item.frontColor = valueToColor(item.value); return item})
  coloredData = coloredData.map(item => {item.capThickness = appCheck(item.value); return item})
  return coloredData
}

const appCheck = (value:number) : number => {
  if(Math.random() >= 0.5 ){
    return 0;
  }
  else{
    return 2;
  }
}

const valueToColor = (value:number) : string => {
  if(value < 25){
    return '#36890E'
  }
  else if (value < 50){
    return '#CFA613'
  }
  else if (value < 75){
    return '#AF2C03'
  }
  else{
    return '#AF0303'
  }
}

const appData = Array.from({length: 24*60/30}, () => {
  return {
    value: Math.floor(Math.random() * 100),
    label: ''
  }
})

appData.forEach((value, index) => {
  if(index % 8 == 0){
    value.label = (index/2).toString();
  }
})

const coloredAppData = dataToColoredData(appData);

export default function AppDateSummaryScreen(){
  const params = useLocalSearchParams<{ date: string, image: string, name: string }>();
  const navigation = useNavigation();
  const date = new Date(parseInt(params.date))

  return(
    <View style={{flex: 3}}>
      <View style={styles.graphContainer}>
        <View style={styles.graph}>
          <BarChart 
          data={coloredAppData}
          cappedBars
          capColor={'white'}
          capThickness={0}
          barWidth={7}
          roundedBottom={false}
          yAxisColor={'white'}
          yAxisTextStyle={{color: 'white'}}
          xAxisColor={'white'}
          xAxisLabelTextStyle={{color: 'white', marginLeft: -15}}
          isAnimated
          noOfSections={4}
          spacing={0}
          onPress = {(item:barDataItem,index:number)=>console.log('item',item)}
          yAxisLabelWidth={30}
          xAxisThickness={1}
          labelWidth={15}
          initialSpacing={15}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  arrowButtons: {
    marginLeft: 20,
    marginRight: 20,
  },
  graphContainer: {
    flex: 1,
  },
  graph: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'black',
 },
  containerLabelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLabelsText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  flatlistItemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#555555',
    margin: 4,
  },
  flatlistItemTextContainer: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayStressCard: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
  },
  todayStressCardText: {
    backgroundColor: 'transparent',
  },
});