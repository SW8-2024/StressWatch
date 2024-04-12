import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';

export default function NotificationScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const params = useLocalSearchParams<{ date: string, topic: string }>();

  const [date, setDate] = useState(new Date(parseInt(params.date)))

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

  const showPreviousMonth = () => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth()-1)))
  };

  const showNextMonth = () => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth()+1)))
  };

  const renderScreenTimeItem = ({item, index}: { item: any, index: number}) => {  
    return (
      <View>
        <View style={{flexDirection: 'row', flex: 1, backgroundColor: 'transparent'}}>
          <View style={{ flex: 2, backgroundColor: 'transparent', justifyContent: 'center'}}>
            <Text>Date</Text>
            <Text>{date.toLocaleTimeString()}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
            <Text>Daily Avg.</Text>
            <Text>{item.dailyAverage}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
            <Text>App Avg.</Text>
            <Text>{item.appAverage}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
            <Text>Amount</Text>
            <Text>{item.amount}</Text>
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
     {/*} <FlatList
        data={notificationData}
        renderItem={renderNotificationItem}/>*/}
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
});
