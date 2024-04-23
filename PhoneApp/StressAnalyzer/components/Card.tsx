import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface CardProps {
    children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <View style={styles.card}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: '#555555',
        borderRadius: 20,
        overflow: 'hidden',
    }
});

export default Card;