import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface CardProps {
    children: ReactNode;
    cardTitle?: string;
    cardSubTitle?: string;
    noPadding?: boolean;
}

export default function Card({ children, cardTitle, cardSubTitle, noPadding }: CardProps): JSX.Element {
    return (
        <View style={{...styles.card, padding: noPadding == true ? 0 : 10}}>
            {cardTitle ? (<Text style={styles.titleStyle}>{cardTitle}</Text>) : ""}
            {cardSubTitle ? (<Text style={styles.subTitleStyle}>{cardSubTitle}</Text>) : ""}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
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
