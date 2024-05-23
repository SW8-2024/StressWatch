import { FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Image } from "react-native";
import { Link, router } from 'expo-router';
import Card from '@/components/Card';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import TabContainer from '@/components/TabContainer';
import { getAppAnalysis } from '@/helpers/Database';
import ErrorWithRetry from '@/components/ErrorWithRetry';
import AnalysisLoading from '@/components/AnalysisLoading';
import { mapAppAnalysisData } from '@/helpers/mappers';
import { AppIcon } from '@/components/AppIcon';
import { getNameFromName } from '@/helpers/appUsage';


export default function ApplicationsScreen() {

  const [appAnalysisData, setAppAnalysisData] = useState<AppAnalysisData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancel = false;
    setRefreshing(true);
    (async () => {
      try {
        let appAnalysis = await getAppAnalysis();
        if (!cancel) {
          setAppAnalysisData(appAnalysis.appUsageAnalysis.map(mapAppAnalysisData).sort(
            (a, b) => {
              let aName = a.name.toUpperCase();
              let bName = b.name.toUpperCase();
              return aName == bName ? 0 : aName < bName ? -1 : 1;
            })
          )
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
      setAppAnalysisData(null);
      cancel = true;
    };
  }, [currentDate]);
  const renderAppsHeader = () => {
    return (
      <View style={styles.flatlistItemContainer}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}></View>
        <View style={{ flex: 4, backgroundColor: 'transparent' }}></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex:2}}><Text style={{ fontWeight: 'bold' }}>Avg. Stress</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex:2}}><Text style={{ fontWeight: 'bold' }}>Ref. Stress</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex:1}} ></View>
      </View>
    )
  }

  const renderAppsItem = ({ item, index }: { item: AppAnalysisData, index: number }) => (
      <Pressable style={styles.flatlistItemContainer} onPress={() => {router.navigate({pathname:"/screenTime", params: {name: item.name, time: Date.now()}})}}>
        <AppIcon packageName={item.name}/>
        <View style={{flex: 4, backgroundColor: 'transparent', justifyContent: 'center' }}><Text numberOfLines={1}> {getNameFromName(item.name)}</Text></View>
        <View style={{...styles.flatlistItemTextContainer, flex:2}}><Text>{item.averageStress != 0 ? Math.round(item.averageStress) : ""}</Text></View>
        <View style={{...styles.flatlistItemTextContainer, flex:2}}><Text>{item.referenceStress != 0 ? Math.round(item.referenceStress) : "" }</Text></View>
        <View style={{...styles.flatlistItemTextContainer, flex:1}}>
          <FontAwesome5
            name="arrow-right"
            size={18}
            color={'white'}
          />
        </View>
      </Pressable>
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
          stickyHeaderIndices={[0]}
          refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => setCurrentDate(new Date())} />
              }
          ListHeaderComponentStyle={styles.flatlistHeaderTextContainer}
           />
      </Card>;
    } else {
      return <AnalysisLoading />;
    }
  }

  return (
    <View style={{flex:1, padding:20}}>
      <Text style={styles.headerStyle}> Apps </Text>
      {renderAppAnalysisTable()}
    </View>
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
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 3,
  },
  headerStyle: {
    color: "white",
    fontSize: 30,
    alignSelf: "center",
    padding: 20,
    textAlign: "center"
  }
});