import { StyleSheet, RefreshControl, FlatList } from 'react-native';
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";//Pass name around as params instead of namefromname
import { BarChart } from "react-native-gifted-charts";
import Card from '@/components/Card';
import { useEffect, useState } from 'react';
import { AppIcon } from '@/components/AppIcon';
import { getNameFromName } from '@/helpers/appUsage';
import { getAppAnalysisByDayByApp } from '@/helpers/Database';
import { mapAppAnalysisByDateAndApp, mapRemoteGraphToInternal } from '@/helpers/mappers';
import AnalysisLoading from '@/components/AnalysisLoading';

export default function AppDateSummaryScreen(){
  const params = useLocalSearchParams<{ date: string, name: string }>();
  const date = new Date(Number(params?.date ?? Date.now()));
  const name = params?.name ?? "";
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState<Boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [graphData, setGraphData] = useState<GraphDataForAppAndDate[] | null>(null)
  const [tableData, setTableData] = useState<AppAnalysisByDayAndApp[] | null>(null)

  useEffect(() => {
    let cancel = false;
    setRefreshing(true);
    (async () => {
      try {
        let endOfDay = date;
        endOfDay.setHours(23,59,59,999);
        let data = await getAppAnalysisByDayByApp(endOfDay, name);
        console.log(data)
        let gData = data.highResolutionStress.map(mapRemoteGraphToInternal)
        gData[gData.length - 1].label = "24"
        setGraphData(gData);
        console.log(gData)
        setTableData(data.appUsageAnalysis.map(mapAppAnalysisByDateAndApp).sort((a,b) => a.startTime.valueOf() - b.startTime.valueOf()));
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
  }, [update]);

  const formatTime = (hours: number, minutes: number, seconds: number) => {
    if (hours + minutes == 0){
      return seconds + "s";
    }else{
      return hours + "h " + minutes + "m";
    }
  }
  const formatDate = (d: Date) => {
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  function renderGraph() {
    if(graphData != null){
      return <View style={{flex:1}}>
      <Card>
        <View style={styles.containerLabelsContainer}><Text style={styles.dateLabel}>{date.toLocaleDateString()}</Text></View>
        <BarChart
          data={graphData}
          cappedBars
          disablePress={true}
          capColor={'white'}
          capThickness={10}
          barWidth={3}
          roundedBottom={false}
          yAxisColor={'white'}
          yAxisTextStyle={{ color: 'white' }}
          xAxisColor={'white'}
          xAxisLabelTextStyle={{ color: 'white', marginLeft: -14, fontSize: 12 }}
          noOfSections={3}
          maxValue={100}
          spacing={0}
          yAxisLabelWidth={30}
          xAxisThickness={3}
          labelWidth={12}
          labelsExtraHeight={5}
          initialSpacing={4}
          endSpacing={5}
        />
      </Card>
    </View>
    }else{
      <View></View>
    }

  }

  const renderAppsHeader = () => {
    return (
      <View style={styles.flatlistItemContainer}>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 1 }}><Text style={{ fontWeight: 'bold' }}>Opened</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 1 }}><Text style={{ fontWeight: 'bold' }}>App avg.</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 1 }}><Text style={{ fontWeight: 'bold' }}>Ref. stress</Text></View>
        <View style={{...styles.flatlistHeaderTextContainer, flex: 1 }}><Text style={{ fontWeight: 'bold' }}>Usage</Text></View>
      </View>
    )
  }

  const renderScreenTimeItem = ({item, index}: { item: AppAnalysisByDayAndApp, index: number}) => {
    return (
          <View style={styles.flatlistItemContainer}>
            <View style={styles.flatlistItemTextContainer}>
              <Text> {formatDate(item.startTime)}</Text>
            </View>
            <View style={styles.flatlistItemTextContainer}>
              <Text>{Math.round(item.averageStress)}</Text>
            </View>
            <View style={styles.flatlistItemTextContainer}>
              <Text>{Math.round(item.referenceStress)}</Text>
            </View>
            <View style={styles.flatlistItemTextContainer}>
              <Text> {formatTime(item.usageHours, item.usageMinutes, item.usageSeconds)} </Text>
            </View>
          </View>
    )
  }

  function renderAnalysisTable () {
      return <Card noPadding>
      <FlatList
        data={tableData}
        renderItem={renderScreenTimeItem}
        ListHeaderComponent={renderAppsHeader}
        ListHeaderComponentStyle={styles.flatlistHeaderTextContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setUpdate(!update)} />
        }
        stickyHeaderIndices={[0]}/>
      </Card>;
  }


  function renderPage () {
    if (graphData == null && tableData == null){
      return <AnalysisLoading/>;
    }else{
      return <View style={{flex:1}}>
      {renderGraph()}
      <View style={{paddingBottom:5, paddingTop:5}}></View>
      {renderAnalysisTable()}
      </View>
    }
  }
  return(
    <View style={{flex:1, padding:20}}>
    <View style={styles.mainHeader}>
      <AppIcon packageName={name}/>
      <Text style={styles.headerStyle}> {getNameFromName(name)} </Text>
      </View>
      {renderPage()}
  </View>);
}

const styles = StyleSheet.create({
  mainHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  dateLabel: {
    color: "white",
    fontSize: 22,
    alignSelf: "center",
    padding: 10,
    textAlign: "center"
  },
  flatlistItemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent',
    margin: 4,
    paddingTop: 5,
    paddingBottom: 5,
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
  },
  containerLabelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555555',
  },
});