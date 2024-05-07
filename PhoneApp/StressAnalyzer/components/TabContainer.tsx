import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

interface CardProps {
    children: ReactNode;
    headerText: string;
}

export default function Card({ children, headerText }: CardProps): JSX.Element {
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.contentContainer}>
                <Text style={styles.headerStyle}>{headerText}</Text>
                {children}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: "column",
        gap: 15,
        padding: 10
    },
    headerStyle: {
        color: "white",
        fontSize: 30,
        alignSelf: "center",
        padding: 20,
        textAlign: "center"
    }
});