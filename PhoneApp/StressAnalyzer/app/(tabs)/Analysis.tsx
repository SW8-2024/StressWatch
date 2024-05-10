import { ActivityIndicator, Button, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import Card from '@/components/Card';
import TabContainer from '@/components/TabContainer';
import MonthlyStressGraph from '@/components/MonthlyStressGraph';
import MostStressfullApps from '@/components/MostStressfullApps';
import { getBreakdown } from '@/helpers/Database';
import { useEffect, useState } from 'react';
import ErrorWithRetry from '@/components/ErrorWithRetry';
import AnalysisLoading from '@/components/AnalysisLoading';
import { mapBreakDownDataToInternal } from '@/helpers/mappers';

export default function AnalysisScreen(): JSX.Element {
  const [breakDownData, setBreakDownData] = useState<BreakDownData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        let breakdown = await getBreakdown(currentDate);
        if (!cancel) {
          setBreakDownData(mapBreakDownDataToInternal(breakdown));
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
      setBreakDownData(null);
      setError(null);
      cancel = true;
    };
  }, [currentDate]);

  const GraphsWithData = ({breakDownData}: {breakDownData: BreakDownData}) => (
    <>
      <Card cardTitle='Stress graph'>
        <MonthlyStressGraph stressAverage={breakDownData.averageStress} dataPoints={breakDownData.dailyStressDataPoints} />
      </Card>
      <Card cardTitle='Most stressful apps'>
        <MostStressfullApps stressAverage={breakDownData.averageStress} stressByApp={breakDownData.stressByApp} />
      </Card>
    </>
  );

  const Loading = () => (<>
    <ActivityIndicator size="large" />
    <Text style={{ textAlign: 'center' }}>Crunching some numbers...</Text>
  </>);

  const Breakdown = () => {
    if (error != null) {
      return (<ErrorWithRetry errorText={error} retry={() => setCurrentDate(new Date())} />);
    } else if (breakDownData != null) {
      return (<GraphsWithData breakDownData={breakDownData} />);
    }
    return (<Loading />);
  };

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setCurrentDate(new Date())} />
        }>
        <TabContainer headerText='Stress breakdown per month'>
          <Breakdown />
        </TabContainer>
      </ScrollView>
    </SafeAreaView>
  );
}