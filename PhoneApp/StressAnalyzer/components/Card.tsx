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
        fontSize: 20
    }
});
