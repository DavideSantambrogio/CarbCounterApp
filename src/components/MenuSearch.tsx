import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

type Props = {
    query: string;
    onChange: (t: string) => void;
};

export default function MenuSearch({ query, onChange }: Props) {
    return (
        <TextInput
            placeholder="Cerca..."
            value={query}
            onChangeText={onChange}
            style={styles.input}
        />
    );
}

const styles = StyleSheet.create({
    input: { width: '80%', marginVertical: 12 },
});
