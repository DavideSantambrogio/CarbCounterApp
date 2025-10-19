import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Paragraph, TextInput } from 'react-native-paper';
import { getFoodsApi, addFoodApi } from '../backend/api';
import { addToPlateApi } from '../backend/api/plateApi';
import { Food } from '../types/Food';

export default function MenuPage() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const items = await getFoodsApi();
            setFoods(items);
        } catch (e) {
            console.warn(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const addSample = async () => {
        await addFoodApi({ name: 'Pane', carbs: 50 });
        await load();
    };

    const [query, setQuery] = useState('');

    const filtered = foods.filter(f => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (String((f as any).name ?? (f as any).alimento)).toLowerCase().includes(q) || String((f as any).id).includes(q);
    });

    const addToPlate = async (item: Food) => {
        await addToPlateApi(item);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Cerca..."
                value={query}
                onChangeText={setQuery}
                style={{ width: '95%', marginBottom: 12 }}
            />

            <Button mode="contained" onPress={addSample} loading={loading} style={{ marginBottom: 12 }}>
                Aggiungi esempio
            </Button>

            <FlatList
                data={filtered}
                keyExtractor={(item) => String((item as any).id)}
                renderItem={({ item }) => (
                    <Card style={{ marginVertical: 6, width: '95%' }}>
                        <Card.Content>
                            <Text style={{ fontSize: 18 }}>{(item as any).name ?? (item as any).alimento}</Text>
                            <Paragraph>Carboidrati: {(item as any).carbs ?? (item as any).cho}</Paragraph>
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => addToPlate(item)}>Aggiungi al piatto</Button>
                        </Card.Actions>
                    </Card>
                )}
                ListEmptyComponent={() => (
                    <Text>Nessun elemento. Premi "Aggiungi esempio" per crearne uno.</Text>
                )}
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
