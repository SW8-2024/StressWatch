import { FlatList, StyleSheet, Image, TouchableOpacity, Pressable, RefreshControl, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useNavigation, Link, router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { useEffect, useState } from 'react';
import { AppIcon } from '@/components/AppIcon';
import { getAppAnalysisPerDayByApp } from '@/helpers/Database';
import { mapAppAnalysisPerDate } from '@/helpers/mappers';
import Card from '@/components/Card';
import { getNameFromName } from '@/helpers/appUsage';
import AnalysisLoading from '@/components/AnalysisLoading';


export default function ScreenTimeScreen() {
  const params = useLocalSearchParams<{ date: string, name: string }>();
  const name = params?.name ?? "";
  const date = new Date(Number(params?.date ?? Date.now()));
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(date);
  const [refreshing, setRefreshing] = useState(false);
  const [screenTimeData, setScreenTimeData] = useState<AppAnalysisByDateData[] | null>(null);

  const formatTime = (hours: number, minutes: number, seconds: number) => {
    return hours + "h " + minutes + "m";
  }
  const formatDate = (d: Date) => {
    if (date.getFullYear() == d.getFullYear()){
      return d.getDate() + "/" + (d.getMonth() + 1);
    }else{
      return d.toLocaleDateString();
    }
  }

  useEffect(() => {
    let cancel = false;
    setRefreshing(true);
    (async () => {
      try {
        let endOfCurrentDate = currentDate;
        endOfCurrentDate.setHours(23,59,59,999);
        let appAnalysis = await getAppAnalysisPerDayByApp(endOfCurrentDate, name);
        if (!cancel) {
          setScreenTimeData(appAnalysis.appUsageForAppAndDays.map(mapAppAnalysisPerDate).sort((a, b) => b.date.valueOf() - a.date.valueOf()));
        }
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
      setScreenTimeData(null);
      cancel = true;
    };
  }, [currentDate]);

  const renderAppsHeader = () => {
    return (
      <View style={styles.flatlistItemContainer}>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 3 }}><Text style={{ fontWeight: 'bold' }}>Date</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 2 }}><Text style={{ fontWeight: 'bold' }}>App avg.</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 2 }}><Text style={{ fontWeight: 'bold' }}>Ref. stress</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 2 }}><Text style={{ fontWeight: 'bold' }}>Usage</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 1 }}></View>
      </View>
    )
  }

  const renderScreenTimeItem = ({item, index}: { item: AppAnalysisByDateData, index: number}) => {
    return (
      <Pressable onPress={() => {router.navigate({pathname: "/appDateSummary", params: { date: item.date.valueOf(), name: params.name }})}}>
        <View style={styles.flatlistItemContainer}>
          <View style={styles.flatlistItemDate}>
            <Text>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.flatlistItemAppAverage}>
            <Text>{Math.round(item.averageStress)}</Text>
          </View>
          <View style={styles.flatlistItemDailyAverage}>
            <Text>{Math.round(item.referenceStress)}</Text>
          </View>
          <View style={styles.flatlistItemUsage}>
            <Text>{formatTime(item.usageHours, item.usageMinutes, item.usageSeconds)}</Text>
          </View>
          <View style={{...styles.flatlistItemTextContainer, flex:1}}>
            <FontAwesome5
              name="arrow-right"
              size={18}
              color={'white'}
            />
          </View>
        </View>
      </Pressable>
    )
  }

function renderAppAnalysisTable() {
  if (screenTimeData != null){
    return <Card noPadding>
    <FlatList
      data={screenTimeData}
      renderItem={renderScreenTimeItem}
      ListHeaderComponent={renderAppsHeader}
      ListHeaderComponentStyle={styles.flatlistHeaderTextContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => setCurrentDate(new Date())} />
      }
      stickyHeaderIndices={[0]}/>
    </Card>;
  }else{
    return <AnalysisLoading/>
  }

}

  return (
    <View style={{flex:1}}>
      <View style={styles.mainHeader}>
        <AppIcon packageName={name}/>
        <Text style={styles.headerStyle}> {getNameFromName(name)} </Text>
        </View>
      {renderAppAnalysisTable()}
    </View>);
}

const styles = StyleSheet.create({
  mainHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  flatlistItemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent',
    margin: 4,
    paddingTop: 5,
    paddingBottom: 5,
  },
  flatlistItemDate: {
    flex: 3,
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
  flatlistHeaderTextContainer: {
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 3,
  },
  flatlistItemTextContainer: {
    flex: 3,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStyle: {
    color: "white",
    fontSize: 30,
    alignSelf: "center",
    padding: 20,
    textAlign: "center"
}
});