import { FlatList, Pressable, StyleSheet, useColorScheme, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';

const getDaysInMonth = (year : number, month : number) => new Date(year, month, 0).getDate()

export default function ScreenTimeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const params = useLocalSearchParams<{ date: string, image: string, name: string }>();

  const [date, setDate] = useState(new Date(parseInt(params.date)))
  
  const screenTimeData = Array.from({length: getDaysInMonth(date.getFullYear(), date.getMonth()+1)}, () => {
    return {
      "dailyAverage": Math.floor(Math.random() * 80),
      "appAverage": Math.floor(Math.random() * 80),
      "usage": Math.floor(Math.random() * 400)
    }
  })

  const showPreviousMonth = () => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth()-1)))
  };

  const showNextMonth = () => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth()+1)))
  };

  const renderScreenTimeItem = ({item, index}: { item: any, index: number}) => {  
    return (
      <View>
        <View style={styles.flatlistItemContainer}>
          <View style={styles.flatlistItemDate}>
            <Text style={styles.statsText}>Date</Text>
            <Text>{index+1}/{date.getMonth()+1}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'transparent'}}></View>
          <View style={styles.flatlistItemDailyAverage}>
            <Text style={styles.statsText}>Daily Avg.</Text>
            <Text>{item.dailyAverage}</Text>
          </View>
          <View style={styles.flatlistItemAppAverage}>
            <Text style={styles.statsText}>App Avg.</Text>
            <Text>{item.appAverage}</Text>
          </View>
          <View style={styles.flatlistItemUsage}>
            <Text style={styles.statsText}>Usage</Text>
            <Text>{item.usage}</Text>
          </View>
        </View>
      </View>
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
      <View style={styles.appContainer}>
        <Image source={Number(params.image)} style={styles.appImage} />
        <Text style={styles.appName}>{params.name}</Text>
      </View>
      <FlatList
        data={screenTimeData}
        renderItem={renderScreenTimeItem}/>
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
    marginVertical: 12,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  arrowButtons: {
    marginLeft: 20,
    marginRight: 20,
  },
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appImage: {
    width: 64,
    height: 64,
  },
  appName: {
    marginLeft: 12,
    fontSize: 24,
  },
  flatlistItemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#555555',
    borderRadius: 20,
    margin: 4,
    padding: 4,
  },
  flatlistItemDate: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  flatlistItemDailyAverage: { 
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
  },
  flatlistItemAppAverage: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistItemUsage: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsText: {
    fontSize: 16,
  },
});