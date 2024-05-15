import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';

type ButtonProps = {
    text: string
    textColor: string
    bgColor: string,
    action: () => void
}

export default function Button({text, textColor, bgColor, action}: ButtonProps) {
    return (
        <Pressable 
            style={[styles.buttonAlt, {backgroundColor: bgColor}]} 
            onPress={action}>
            <Text style={[styles.buttonText, {color: textColor}]}>{text}</Text>        
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonAlt: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        width: 150,      
        backgroundColor: 'red',
        margin: 8,
      },
      buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
      },
})