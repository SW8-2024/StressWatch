import { FlatList, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Text, View } from '@/components/Themed';
import { BarChart } from "react-native-chart-kit";
import { Dimensions, Image } from "react-native";
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const screenHeight = Dimensions.get("window").height/3;
const screenWidth = Dimensions.get("window").width-20;
const graphData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 67, 45, 28, 80, 99, 43, 67, 45, 28, 80, 99, 43, 67, 45, 28, 80, 99, 43],
    }
  ]
};
const screenTimeData = [
  {
    "image": require("../../assets/images/TinderImage.png"),
    "name": "Tinder",
    "averageStress": 58,
    "usage": 403
  },
  {
    "image": require("../../assets/images/TwitterImage.png"),
    "name": "Twitter",
    "averageStress": 34,
    "usage": 3163
  }
]
const notificationData = [
  {
    "topic": "Bouldering",
    "averageStress": 81,
    "amount": 62
  },
  {
    "topic": "Dinner plans",
    "averageStress": 22,
    "amount": 11
  }
]

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#555555",
  backgroundGradientToOpacity: 0.2,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(26, 255, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.25,
  useShadowColorFromDataset: false
};

const dataToColoredData = (data:ChartData) : ChartData => {
  const coloredData:ChartData = data
  coloredData.datasets[0].colors = data.datasets[0].data.map(point => valueToColor(point))
  return coloredData
}

const valueToColor = (value:number) : ((opacity:number) => string) => {
  if(value < 44){
    return ((opacity = 1) => '#36890E')
  }
  else if (value < 60){
    return ((opacity = 1) => '#CFA613')
  }
  else if (value < 80){
    return ((opacity = 1) => '#AF2C03')
  }
  else{
    return ((opacity = 1) => '#AF0303')
  }
}

const coloredData = dataToColoredData(graphData)

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';

  const [date, setDate] = useState(new Date())

  const showPreviousMonth = () => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth()-1)))
  };

  const showNextMonth = () => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth()+1)))
  };

  const renderAppsHeader = () => {  
    return (
      <View style={styles.flatlistItemContainer}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}></View>
        <View style={{flex: 4, backgroundColor: 'transparent'}}></View>
        <View style={styles.flatlistItemTextContainer}><Text style={{fontWeight: 'bold'}}>Avg. Stress</Text></View>
        <View style={styles.flatlistItemTextContainer}><Text style={{fontWeight: 'bold'}}>Usage</Text></View>
      </View>
    )
  }
  
  const renderAppsItem = ({item, index}: { item: any, index: number}) => (
    <Link href={{pathname: "/screenTime", params: { date: date.getTime(), image: item.image, name: item.name }}} asChild>
      <Pressable style={styles.flatlistItemContainer}>
        <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center'}}><Image source={item.image} /></View>
        <View style={{ flex: 4, backgroundColor: 'transparent', justifyContent: 'center'}}><Text>{item.name}</Text></View>
        <View style={styles.flatlistItemTextContainer}><Text>{item.averageStress}</Text></View>
        <View style={styles.flatlistItemTextContainer}><Text>{item.usage}</Text></View>
      </Pressable>
    </Link>
  )
  
  const renderNotificationHeader = () => {  
    return (
      <View style={styles.flatlistItemContainer}>
        <View style={{flex: 5, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}><Text style={{fontWeight: 'bold'}}>Topic</Text></View>
        <View style={styles.flatlistItemTextContainer}><Text style={{fontWeight: 'bold'}}>Avg. Stress</Text></View>
        <View style={styles.flatlistItemTextContainer}><Text style={{fontWeight: 'bold'}}>Amount</Text></View>
      </View>
    )
  }
  
  const renderNotificationItem = ({item, index}: { item: any, index: number}) => {  
    return (
      <Link href={{pathname: "/notification", params: { date: date.getTime(), topic: item.topic }}} asChild>
        <Pressable style={styles.flatlistItemContainer}>
          <View style={{ flex: 5, backgroundColor: 'transparent', justifyContent: 'center'}}><Text>{item.topic}</Text></View>
          <View style={styles.flatlistItemTextContainer}><Text>{item.averageStress}</Text></View>
          <View style={styles.flatlistItemTextContainer}><Text>{item.amount}</Text></View>
        </Pressable>
      </Link>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <Pressable onPress={showPreviousMonth}>
          <FontAwesome5
            name="chevron-left"
            size={24}
            color={Colors[colorScheme].text}
            style={styles.arrowButtons}
          />
        </Pressable>
        <Text style={styles.monthText}>{date.toLocaleString('default', { month: 'long' })}</Text>
        <Pressable onPress={showNextMonth}>
          <FontAwesome5
            name="chevron-right"
            size={24}
            color={Colors[colorScheme].text}
            style={styles.arrowButtons}
          />
        </Pressable>
      </View>
      <View style={{flex: 3}}>
        <View style={styles.graphContainer}>
          <View style={styles.graph}>
            <BarChart
              data={coloredData}
              width={screenWidth}
              height={screenHeight}
              yAxisLabel=""
              yAxisSuffix=''
              chartConfig={chartConfig}
              fromZero={true}
              withCustomBarColorFromData={true}
              showBarTops={false}
              flatColor={true}
            />
          </View>
        </View>
      </View>
      <View style={{flex: 2}}>
        <View style={styles.containerLabelsContainer}><Text style={styles.containerLabelsText}>Apps</Text></View>
        <View style={styles.appsContainer}>
          <FlatList
            data={screenTimeData}
            renderItem={renderAppsItem}
            ListHeaderComponent={renderAppsHeader}
            stickyHeaderIndices={[0]}/>
        </View>
      </View>
      <View style={{flex: 2}}>
        <View style={styles.containerLabelsContainer}><Text style={styles.containerLabelsText}>Notifications</Text></View>
        <View style={styles.notificationContainer}>
          <FlatList
            data={notificationData}
            renderItem={renderNotificationItem}
            ListHeaderComponent={renderNotificationHeader}
            stickyHeaderIndices={[0]}/>
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
    marginLeft: 10,
  },
  appsContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#555555',
    borderRadius: 20,
    overflow:'hidden',
  },
  notificationContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#555555',
    borderRadius: 20,
    overflow:'hidden',
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
});
