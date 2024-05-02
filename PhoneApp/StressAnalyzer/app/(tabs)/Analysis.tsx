import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import Card from '@/components/Card';
import TabContainer from '@/components/TabContainer';
import MonthlyStressGraph from '@/components/MonthlyStressGraph';

export default function AnalysisScreen() {
  return (
    <TabContainer headerText='Stress breakdown per month'>
      <Card cardTitle='Stress graph'>
        <MonthlyStressGraph />
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