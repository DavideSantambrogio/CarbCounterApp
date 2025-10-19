import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Paragraph, TextInput } from 'react-native-paper';
import { getFoodsApi, addFoodApi } from '../backend/api';
import { addToPlateApi, getPlateApi, subscribePlateApi } from '../backend/api/plateApi';
import Toast from '../components/Toast';
import { Food } from '../types/Food';

export default function MenuPage() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

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

    // reset pagination when query changes
    useEffect(() => { setPage(1); }, [query]);

    const visible = filtered.slice(0, page * pageSize);

    const addToPlate = async (item: Food) => {
        const added = await addToPlateApi(item);
        if (added) {
            setToastMessage(`${(item as any).name ?? (item as any).alimento} aggiunto al piatto`);
        } else {
            setToastMessage(`${(item as any).name ?? (item as any).alimento} già presente nel piatto`);
        }
        setToastVisible(true);
    };

    // plate items to disable add button when already present
    const [plateItems, setPlateItems] = useState<Food[]>([]);

    const loadPlateItems = async () => {
        try {
            const p = await getPlateApi();
            setPlateItems(p);
        } catch (e) {
            console.warn(e);
        }
    };

    useEffect(() => {
        loadPlateItems();
        const unsub = subscribePlateApi(() => loadPlateItems());
        return unsub;
    }, []);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Cerca..."
                value={query}
                onChangeText={setQuery}
                style={{ width: '95%' }}
            />


            <FlatList
                data={visible}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyExtractor={(item) => String((item as any).id)}
                renderItem={({ item }) => (
                    <Card style={{ marginVertical: 6, width: '95%' }}>
                        <Card.Content>
                            <Text style={{ fontSize: 18 }}>{(item as any).name ?? (item as any).alimento}</Text>
                            <Paragraph>Carboidrati: {(item as any).carbs ?? (item as any).cho}</Paragraph>
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => addToPlate(item)} disabled={!!plateItems.find(p => String(p.id) === String((item as any).id))}>
                                Aggiungi al piatto
                            </Button>
                        </Card.Actions>
                    </Card>
                )}
                ListEmptyComponent={() => (
                    <Text>Nessun elemento. Premi "Aggiungi esempio" per crearne uno.</Text>
                )}
                ListFooterComponent={() => (
                    visible.length < filtered.length ? (
                        <Button mode="outlined" onPress={() => setPage(p => p + 1)} style={{ marginVertical: 12 }}>
                            Vedi altro
                        </Button>
                    ) : null
                )}
                onEndReachedThreshold={0.5}
            />

            <Toast
                visible={toastVisible}
                message={toastMessage}
                onDismiss={() => setToastVisible(false)}
            />
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
