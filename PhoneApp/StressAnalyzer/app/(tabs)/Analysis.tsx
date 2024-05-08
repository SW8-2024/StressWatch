import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import Card from '@/components/Card';
import TabContainer from '@/components/TabContainer';
import MonthlyStressGraph from '@/components/MonthlyStressGraph';
import MostStressfullApps from '@/components/MostStressfullApps';
import { BreakDownData, getBreakdown } from '@/helpers/Database';
import { useEffect, useState } from 'react';
import ErrorWithRetry from '@/components/ErrorWithRetry';
import AnalysisLoading from '@/components/AnalysisLoading';



function renderWithData(breakDownData: BreakDownData): JSX.Element {
  return <>
    <Card cardTitle='Stress graph'>
      <MonthlyStressGraph stressAverage={breakDownData.averageStress} dataPoints={breakDownData.dailyStressDataPoints} />
    </Card>
    <Card cardTitle='Most stressful apps'>
      <MostStressfullApps stressAverage={breakDownData.averageStress} stressByApp={breakDownData.stressByApp} />
    </Card>
  </>
}

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
      setBreakDownData(null);
      setError(null);
      cancel = true;
    };
  }, [currentDate]);

  let innerContent = <></>;
  if (error != null) {
    innerContent = <ErrorWithRetry errorText={error} retry={() => setCurrentDate(new Date())} />;
  } else if (breakDownData != null) {
    innerContent = renderWithData(breakDownData);
  } else {
    innerContent = <AnalysisLoading />;
  }

  return (
    <TabContainer headerText='Stress breakdown per month'>
      <Button title='refresh' onPress={() => setCurrentDate(new Date())}/>
      {innerContent}
    </TabContainer>
  );
}

const styles = StyleSheet.create({

});