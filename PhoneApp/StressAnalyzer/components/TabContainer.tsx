import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface CardProps {
    children: ReactNode;
    headerText: string;
}

export default function Card({ children, headerText }: CardProps): JSX.Element {
    return (
        <View style={styles.tabContainer}>
            <Text style={styles.headerStyle}>{headerText}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
        flexDirection: "column",
        gap: 15,
        padding: 10
    },
    headerStyle: {
        color: "white",
        fontSize: 26,
        alignSelf: "center",
        padding: 20
    }
});