import { StyleSheet } from 'react-native';
import { getUsageStatsAsync, addChangeListener } from '@/modules/app-usage';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';

export default function TabOneScreen() {
  const [usageStats, setUsageStats] = useState<[UsageData]>();

  // export function addClipboardListener(listener: (event) => void): Subscription {
  //   return emitter.addListener('onClipboardChanged', listener);
  // }
  useEffect(() => {
    getUsageStatsAsync(Date.now() - 345600000, Date.now());    
    addChangeListener(onUsageData);
    // return () => subscription.remove();
  }, [setUsageStats]);

  const onUsageData = (event: any) => {
    let data = event.nativeEvent;
    console.log(event);
  }

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Tab iksajdasfdsfdsfsdOne</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
