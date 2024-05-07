import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface CardProps {
    children: ReactNode;
    cardTitle?: string;
    cardSubTitle?: string;
}

export default function Card({ children, cardTitle, cardSubTitle }: CardProps): JSX.Element {
    return (
        <View style={styles.card}>
            {cardTitle ? <Text style={styles.titleStyle}>{cardTitle}</Text> : ""}
            {cardSubTitle ? <Text style={styles.subTitleStyle}>{cardSubTitle}</Text> : ""}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        backgroundColor: '#555555',
        borderRadius: 10,
        overflow: 'hidden',
    },
    titleStyle: {
        color: "white",
        fontSize: 26
    },
    subTitleStyle: {
        color: "#DDDDDD",
        fontSize: 18
    }
});
