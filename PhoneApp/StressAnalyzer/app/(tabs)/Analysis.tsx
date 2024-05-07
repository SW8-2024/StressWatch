import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import Card from '@/components/Card';
import TabContainer from '@/components/TabContainer';
import MonthlyStressGraph from '@/components/MonthlyStressGraph';
import MostStressfullApps from '@/components/MostStressfullApps';
import { BreakDownData, getBreakdown } from '@/helpers/Database';
import { useEffect, useState } from 'react';

const currentDate =  new Date();

export default function AnalysisScreen() {
  
  const [breakDownData, setBreakDownData] = useState<BreakDownData | null>(null);

  let innerContent = <><Text>Loading...</Text></>;

  useEffect(() => {
    let ignore = false;
    getBreakdown(currentDate)
      .then((v) => {
        if (!ignore) {
          setBreakDownData(v);
        }
      });
    return () => {
      ignore = true;
    };
  }, [])
  
  if (breakDownData != null) {
    innerContent = <>
      <Card cardTitle='Stress graph'>
          <MonthlyStressGraph stressAverage={breakDownData.stressAverage} dataPoints={breakDownData.dailyStressDataPoints} />
        </Card>
        <Card cardTitle='Most stressful apps'>
          <MostStressfullApps stressAverage={breakDownData.stressAverage} stressByApp={breakDownData.stressByApp}/>
        </Card> 
    </>
  }

  return (
    <TabContainer headerText='Stress breakdown per month'>
      {innerContent}
    </TabContainer>
  );
}

const styles = StyleSheet.create({

});