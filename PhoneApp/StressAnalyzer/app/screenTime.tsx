import { FlatList, StyleSheet, useColorScheme, Image, TouchableOpacity, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useNavigation, Link } from 'expo-router';
import { useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';

const getDaysInMonth = (year : number, month : number) => new Date(year, month, 0).getDate()

export default function ScreenTimeScreen() {
  const params = useLocalSearchParams<{ date: string, image: string, name: string }>();
  const navigation = useNavigation();
  const date = new Date(parseInt(params.date))
  
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  };

  const screenTimeData = Array.from({length: getDaysInMonth(date.getFullYear(), date.getMonth()+1)}, () => {
    return {
      "dailyAverage": Math.floor(Math.random() * 80),
      "appAverage": Math.floor(Math.random() * 80),
      "usage": formatMinutes(Math.floor(Math.random()*100))
    }
  })

  const renderScreenTimeItem = ({item, index}: { item: any, index: number}) => {  
    return (
      <Link href={{pathname: "/appDateSummary", params: { date: params.date, image: params.image, name: params.name }}} asChild>
        <Pressable>
          <View style={styles.flatlistItemContainer}>
            <View style={styles.flatlistItemDate}>
              <Text style={styles.statsText}>Date</Text>
              <Text>{screenTimeData.length - index}/{date.getMonth()+1}/{date.getFullYear()}</Text>
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
        </Pressable>
      </Link>
    )
  }

  return (
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
        <View/>
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