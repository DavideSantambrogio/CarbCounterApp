import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function AdminPage() {
    return (
        <View style={styles.container}>
            <Text style={globalStyles.title}>Admin</Text>
            <Text style={globalStyles.subtitle}>Pannello di amministrazione</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 40,
    },
});
