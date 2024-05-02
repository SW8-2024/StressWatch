import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import Card from '@/components/Card';
import TabContainer from '@/components/TabContainer';
import MonthlyStressGraph from '@/components/MonthlyStressGraph';
import { breakDownData } from '@/constants/DummyData';

export default function AnalysisScreen() {
  return (
    <TabContainer headerText='Stress breakdown per month'>
      <Card cardTitle='Stress graph'>
        <MonthlyStressGraph stressAverage={breakDownData.stressAverage} dataPoints={breakDownData.dailyStressDataPoints} />
      </Card>
      <Card>
        <Text>benis</Text>
      </Card>
      <Card>
        <Text>begni</Text>
      </Card>
    </TabContainer>
  );
}

const styles = StyleSheet.create({

});