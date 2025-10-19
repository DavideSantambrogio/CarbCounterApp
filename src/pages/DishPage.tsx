import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Paragraph, TextInput, DataTable, IconButton } from 'react-native-paper';
import { getPlateApi, removeFromPlateApi, clearPlateApi, subscribePlateApi, updatePlateItemApi } from '../backend/api/plateApi';

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

    const onGramsChange = async (id: string, gramsValue: string) => {
        const grams = Number(gramsValue) || 0;
        await updatePlateItemApi(id, { grams });
        await load();
    };

    const choForItem = (item: any) => {
        const choPer100 = Number(item?.carbs ?? item?.cho ?? 0);
        const grams = Number(item?.grams ?? 0);
        return (choPer100 / 100) * grams;
    };

    const totalCho = plate.reduce((sum, it) => sum + choForItem(it), 0);

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={clearAll} style={{ marginBottom: 12 }}>Svuota piatto</Button>

            <Card style={{ width: '95%' }}>
                <Card.Content>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={styles.colName}>Alimento</DataTable.Title>
                            <DataTable.Title numeric style={styles.colGrams}>Grammi</DataTable.Title>
                            <DataTable.Title numeric style={styles.colCho}>CHO</DataTable.Title>
                            <DataTable.Title numeric style={styles.colActions}>Azioni</DataTable.Title>
                        </DataTable.Header>

                        {plate.length === 0 ? (
                            <View style={{ padding: 12 }}>
                                <Text>Il piatto è vuoto</Text>
                            </View>
                        ) : (
                            plate.map((item) => (
                                <DataTable.Row key={String(item.id)}>
                                    <DataTable.Cell style={styles.colName}>{item?.name ?? item?.alimento}</DataTable.Cell>
                                    <DataTable.Cell numeric style={styles.colGrams}>
                                        <TextInput
                                            mode="outlined"
                                            dense
                                            keyboardType="numeric"
                                            value={String(item?.grams ?? 0)}
                                            onChangeText={(t) => onGramsChange(item.id, t)}
                                        />
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={styles.colCho}>{choForItem(item).toFixed(2)}</DataTable.Cell>
                                    <DataTable.Cell numeric style={[styles.colActions, styles.actionCell]}>
                                        <IconButton
                                            icon="trash-can-outline"
                                            size={20}
                                            onPress={() => remove(item.id)}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))
                        )}

                        <DataTable.Row>
                            <DataTable.Cell style={styles.colName}>Total</DataTable.Cell>
                            <DataTable.Cell style={styles.colGrams}>{""}</DataTable.Cell>
                            <DataTable.Cell numeric style={styles.colCho}>{totalCho.toFixed(2)}</DataTable.Cell>
                            <DataTable.Cell style={styles.colActions}>{""}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </Card.Content>
            </Card>
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
    cell: {
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        paddingHorizontal: 6,
    },
    cellLast: {
        paddingHorizontal: 6,
    },
    // fixed column widths to keep table aligned
    colName: {
        width: 300,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    colGrams: {
        width: 50,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        alignItems: 'center',
    },
    colCho: {
        width: 50,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    colActions: {
        width: 50,
        paddingHorizontal: 8,
    },
    actionCell: {
        alignItems: 'center',
        justifyContent: 'center',
    },

});
