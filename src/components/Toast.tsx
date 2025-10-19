import React from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

interface ToastProps {
    visible: boolean;
    message: string;
    duration?: number; // milliseconds
    onDismiss?: () => void;
}

export default function Toast({ visible, message, duration = 3000, onDismiss = () => { } }: ToastProps) {
    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={duration}
            style={styles.snackbar}
        >
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    snackbar: {
        margin: 16,
    },
});
