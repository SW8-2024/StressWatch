import { Button, FlatList, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Image } from "react-native";
import { Link } from 'expo-router';
import Card from '@/components/Card';
import { screenTimeData } from '@/constants/DummyData';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import TabContainer from '@/components/TabContainer';
import { getAppAnalysis } from '@/helpers/Database';
import ErrorWithRetry from '@/components/ErrorWithRetry';
import AnalysisLoading from '@/components/AnalysisLoading';
import { mapAppAnalysisData } from '@/helpers/mappers';


const tinderImage = require("@/assets/images/TinderImage.png");

export default function ApplicationsScreen() {

  const [appAnalysisData, setAppAnalysisData] = useState<AppAnalysisData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        let appAnalysis = await getAppAnalysis();
        if (!cancel) {
          setAppAnalysisData(appAnalysis.appUsageAnalysis.map(mapAppAnalysisData));
        }
      } catch (e) {
        setError((e ?? "unknown error").toString());
      }
    })();
    return () => {
      setError(null);
      setAppAnalysisData(null);
      cancel = true;
    };
  }, [currentDate]);

  const renderAppsHeader = () => {
    return (
      <View style={styles.flatlistItemContainer}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}></View>
        <View style={{ flex: 4, backgroundColor: 'transparent' }}></View>
        <View style={styles.flatlistHeaderTextContainer}><Text style={{ fontWeight: 'bold' }}>Avg. Stress</Text></View>
        <View style={styles.flatlistHeaderTextContainer}><Text style={{ fontWeight: 'bold' }}>Ref. Stress</Text></View>
        <View style={styles.flatlistHeaderTextContainer}></View>
      </View>
    )
  }

  const renderAppsItem = ({ item, index }: { item: any, index: number }) => (
    <Link href={{ pathname: "/screenTime", params: { date: Date.now(), image: tinderImage, name: item.name } }} asChild>
      <Pressable style={styles.flatlistItemContainer}>
        <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center' }}><Image source={tinderImage} style={styles.imageStyle} /></View>
        <View style={{ flex: 4, backgroundColor: 'transparent', justifyContent: 'center' }}><Text>{item.name}</Text></View>
        <View style={styles.flatlistItemTextContainer}><Text>{Math.round(item.averageStress)}</Text></View>
        <View style={styles.flatlistItemTextContainer}><Text>{Math.round(item.referenceStress)}</Text></View>
        <View style={styles.flatlistItemTextContainer}>
          <FontAwesome5
            name="arrow-right"
            size={18}
            color={'white'}
          />
        </View>
      </Pressable>
    </Link>
  )

  function renderAppAnalysisTable() {
    if (error != null) {
      return <ErrorWithRetry errorText={error} retry={() => setCurrentDate(new Date())} />;
    } else if (appAnalysisData != null) {
      return <Card noPadding>
        <FlatList
          data={appAnalysisData}
          renderItem={renderAppsItem}
          ListHeaderComponent={renderAppsHeader}
          ListHeaderComponentStyle={styles.flatlistHeaderTextContainer}
          stickyHeaderIndices={[0]} />
      </Card>;
    } else {
      return <AnalysisLoading />;
    }
  }

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setCurrentDate(new Date())} />
        }>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  flatlistItemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent',
    margin: 4,
    paddingTop: 5,
    paddingBottom: 5,
  },
  flatlistItemTextContainer: {
    flex: 3,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistHeaderTextContainer: {
    flex: 3,
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 3,
  },
  containerLabelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLabelsText: {
    fontSize: 30,
    padding: 30,
  },
  imageStyle: {
    width: 24,
    height: 24,
  },
});