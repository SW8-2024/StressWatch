import { getAppIconFromName } from '@/helpers/appUsage';
import { StyleSheet, Image, View, Text} from 'react-native';

export const AppIcon = function AppIcon({ packageName } : {packageName : string}){
    const icon = getAppIconFromName(packageName);

    if (icon == ""){
        return <View style={styles.backupIcon}/>
    }else{
        return <Image style={styles.icon} source={{uri:`data:image/jpeg;base64, ${icon}`} } />
    }
};

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30,
        backgroundColor: 'transparent'
    },
    backupIcon: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
    }
});
