import { StyleSheet } from 'react-native';
import { getUsageStatsAsync, addUsageDataListener } from '@/modules/app-usage';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import * as appUsage from '@/helpers/appUsage';

export default function TabOneScreen() {
  useEffect(() => {
    appUsage.attachHandler();
    // appUsage.getUsageDataLastInterval();
    // appUsage.getUsageDataLastInterval();
    // appUsage.printLastMinutes(600);
    appUsage.getEventData()

  }, []);
  
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
