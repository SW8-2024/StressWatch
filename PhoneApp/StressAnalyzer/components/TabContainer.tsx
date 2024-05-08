import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

interface CardProps {
    children: ReactNode;
    headerText: string;
    noScroll?: boolean
}

export default function Card({ children, headerText, noScroll }: CardProps): JSX.Element {
    let inner = <View style={styles.contentContainer}>
        <Text style={styles.headerStyle}>{headerText}</Text>
        {children}
    </View>;
    if (noScroll == true) {
        return inner;
    } else {
        return (
            <ScrollView style={styles.scrollView}>
                {inner}
            </ScrollView>
        );
    }
    
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: "column",
        gap: 15,
        padding: 20
    },
    headerStyle: {
        color: "white",
        fontSize: 30,
        alignSelf: "center",
        padding: 20,
        textAlign: "center"
    }
});