import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import Card from '@/components/Card';
import TabContainer from '@/components/TabContainer';
import MonthlyStressGraph from '@/components/MonthlyStressGraph';
import MostStressfullApps from '@/components/MostStressfullApps';
import { getBreakdown } from '@/helpers/Database';
import { useEffect, useState } from 'react';
import ErrorWithRetry from '@/components/ErrorWithRetry';

export default function AnalysisScreen(): JSX.Element {
  const [breakDownData, setBreakDownData] = useState<BreakDownData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        let breakdown = await getBreakdown(currentDate);
        if (!cancel) {
          setBreakDownData(breakdown);
        }
      } catch (e) {
        setError((e ?? "unknown error").toString());
      }
    })();
    return () => {
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
    <TabContainer headerText='Stress breakdown per month'>
      <Button title='refresh' onPress={() => setCurrentDate(new Date())}/>
      <Breakdown />
    </TabContainer>
  );
}