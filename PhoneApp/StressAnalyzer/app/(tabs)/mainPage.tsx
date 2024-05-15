import { ActivityIndicator, Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Stressometer from '@/components/Stressometer';
import TabContainer from '@/components/TabContainer';
import { getStressMetrics } from '@/helpers/Database';
import ErrorWithRetry from '@/components/ErrorWithRetry';

export default function HomeScreen() {
  const [stressMetrics, setStressMetrics] = useState<StressMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        let stressMetrics = await getStressMetrics(currentDate);
        if (!cancel) {
          setStressMetrics(stressMetrics);
        }
      } catch (e) {
        setError((e ?? "unknown error").toString());
      }
    })();
    return () => {
      setStressMetrics(null);
      setError(null);
      cancel = true;
    };
  }, [currentDate]);

  const OverviewCardContent = ({ metrics }: { metrics: StressMetrics }) => (
    <View style={styles.todayStressCard}>
      <Stressometer stressValue={Math.round(metrics.latest)} />
      <View style={styles.todayStressCardText}>
        <Text>Average: {Math.round(metrics.average)}</Text>
        <Text>Low: {Math.round(metrics.min)}</Text>
        <Text>High: {Math.round(metrics.max)}</Text>
      </View>
    </View>
  );

  const TodayStressCard = () => {
    if (stressMetrics != null) {
      return (<OverviewCardContent metrics={stressMetrics} />);
    } else if (error != null) {
      return (<ErrorWithRetry errorText={error} retry={() => setCurrentDate(new Date())} />);
    }
    return (<>
      <ActivityIndicator size="large" />
      <Text style={{ textAlign: 'center' }}>Loading...</Text>
    </>);
  }

  return (
    <TabContainer headerText='Home'>
      <Button title='refresh' onPress={() => setCurrentDate(new Date())} />
      <Card cardTitle="Today's Stress">
        <TodayStressCard />
      </Card>
    </TabContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  arrowButtons: {
    marginLeft: 20,
    marginRight: 20,
  },
  containerLabelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLabelsText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  flatlistItemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#555555',
    margin: 4,
  },
  flatlistItemTextContainer: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayStressCard: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
  },
  todayStressCardText: {
    backgroundColor: 'transparent',
  },
});
