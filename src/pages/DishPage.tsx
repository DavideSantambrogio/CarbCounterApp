import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { getPlateApi, removeFromPlateApi, clearPlateApi, subscribePlateApi } from '../backend/api/plateApi';

export default function DishPage() {
    const [plate, setPlate] = useState<any[]>([]);

    const load = async () => {
        const items = await getPlateApi();
        setPlate(items);
    };

    useEffect(() => {
        load();
        const unsubscribe = subscribePlateApi(() => {
            load();
        });
        return unsubscribe;
    }, []);

    const remove = async (id: string) => {
        await removeFromPlateApi(id);
        await load();
    };

    const clearAll = async () => {
        await clearPlateApi();
        await load();
    };

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={clearAll} style={{ marginBottom: 12 }}>Svuota piatto</Button>
            <FlatList
                data={plate}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Card style={{ marginVertical: 6, width: '95%' }}>
                        <Card.Content>
                            <Text style={{ fontSize: 18 }}>{(item as any).name ?? (item as any).alimento}</Text>
                            <Paragraph>Carboidrati: {(item as any).carbs ?? (item as any).cho}</Paragraph>
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => remove(item.id)}>Rimuovi</Button>
                        </Card.Actions>
                    </Card>
                )}
                ListEmptyComponent={() => <Text>Il piatto è vuoto</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 12,
    },
});
