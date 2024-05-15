import { StyleSheet, TouchableOpacity, Image, Button, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import Card from '@/components/Card';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancel = false;
    setRefreshing(true);
    (async () => {
      try {
        // implement when data received from database
      } catch (e) {
        setError((e ?? "unknown error").toString());
      } finally {
        if (!cancel) {
          setRefreshing(false);
        }
      }
    })();
    return () => {
      setError(null);
      cancel = true;
    };
  }, [currentDate]);

  return(
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={() => setCurrentDate(new Date())} />
    }>
      <View style={styles.container}>
        <View style={styles.appHeaderContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5
              name="arrow-left"
              size={24}
              color={'white'}
            />
          </TouchableOpacity>
          <View style={styles.appContainer}>
            <Image source={Number(params.image)} style={styles.appImage} />
            <Text style={styles.appName}>{params.name}</Text>
          </View>
          <View />
        </View>
        <View style={{ flex: 3 }}>
          <Card>
            <View style={styles.containerLabelsContainer}><Text style={styles.containerLabelsText}>{date.getUTCDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text></View>
            <BarChart
              data={coloredAppData}
              cappedBars
              capColor={'white'}
              capThickness={0}
              barWidth={6}
              roundedBottom={false}
              yAxisColor={'white'}
              yAxisTextStyle={{ color: 'white' }}
              xAxisColor={'white'}
              xAxisLabelTextStyle={{ color: 'white', marginLeft: -15 }}
              isAnimated
              noOfSections={4}
              spacing={0}
              onPress={(item: barDataItem, index: number) => console.log('item', item)}
              yAxisLabelWidth={30}
              xAxisThickness={1}
              labelWidth={15}
              labelsExtraHeight={5}
              initialSpacing={15}
              endSpacing={20}
            />
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arrowButtons: {
    marginLeft: 20,
    marginRight: 20,
  },
  appHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 12,
  },
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 24,
  },
  appImage: {
    width: 64,
    height: 64,
  },
  appName: {
    marginLeft: 12,
    fontSize: 24,
  },
  graph: {
    flex: 1,
    marginTop: 20,
 },
  containerLabelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555555',
  },
  containerLabelsText: {
    fontSize: 36,
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
});