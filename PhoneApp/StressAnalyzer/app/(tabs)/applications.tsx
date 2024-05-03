import { FlatList, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Image } from "react-native";
import { Link } from 'expo-router';
import Card from '@/components/Card';
import { screenTimeData } from '@/constants/DummyData';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';


export default function ApplicationsScreen() {
    const [date] = useState(new Date());

    const renderAppsHeader = () => {  
        return (
          <View style={styles.flatlistItemContainer}>
            <View style={{flex: 1, backgroundColor: 'transparent'}}></View>
            <View style={{flex: 4, backgroundColor: 'transparent'}}></View>
            <View style={styles.flatlistHeaderTextContainer}><Text style={{fontWeight: 'bold'}}>Avg. Stress</Text></View>
            <View style={styles.flatlistHeaderTextContainer}><Text style={{fontWeight: 'bold'}}>Ref. Stress</Text></View>
            <View style={styles.flatlistHeaderTextContainer}></View>
          </View>
        )
      }

    const renderAppsItem = ({item, index}: { item: any, index: number}) => (
        <Link href={{pathname: "/screenTime", params: { date: date.getTime(), image: item.image, name: item.name }}} asChild>
          <Pressable style={styles.flatlistItemContainer}>
            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center'}}><Image source={item.image} style={styles.imageStyle} /></View>
            <View style={{ flex: 4, backgroundColor: 'transparent', justifyContent: 'center'}}><Text>{item.name}</Text></View>
            <View style={styles.flatlistItemTextContainer}><Text>{item.averageStress}</Text></View>
            <View style={styles.flatlistItemTextContainer}><Text>{item.referenceStress}</Text></View>
            <View style={styles.flatlistItemTextContainer}>
              <FontAwesome5
                name="arrow-right"
                size={18}
                color={'white'}
                />
            </View>
          </Pressable>
        </Link>
      )

    return (
        <View style={{flex: 2}}>
        <View style={styles.containerLabelsContainer}><Text style={styles.containerLabelsText}>Apps</Text></View>
        <Card>
          <FlatList
            data={screenTimeData}
            renderItem={renderAppsItem}
            ListHeaderComponent={renderAppsHeader}
            ListHeaderComponentStyle={styles.flatlistHeaderTextContainer}
            stickyHeaderIndices={[0]}/>
        </Card>
      </View>
    );
}


const styles = StyleSheet.create({
    flatlistItemContainer: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'transparent',
        margin: 4,
        paddingTop: 5,
        paddingBottom: 5,
    },
    flatlistItemTextContainer: {
        flex: 3,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlistHeaderTextContainer: {
        flex: 3,
        backgroundColor: '#3B3B3B',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 3,
        paddingBottom: 3,
    },
    containerLabelsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerLabelsText: {
        fontSize: 30,
        padding: 30,
    },
    imageStyle: {
        width: 24,
        height: 24,
    },
});