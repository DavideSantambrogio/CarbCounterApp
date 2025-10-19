import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, TextInput, IconButton } from 'react-native-paper';
import { View as RNView } from 'react-native';
import { getPlateApi, removeFromPlateApi, clearPlateApi, subscribePlateApi, updatePlateItemApi } from '../backend/api/plateApi';
import globalStyles from '../styles/globalStyles';

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
            <Text style={globalStyles.title}>Il tuo Piatto</Text>
            <Text style={globalStyles.subtitle}>Scegli quanti grammi di ogni alimento mangiare</Text>
            <Card style={{ width: '95%' }}>
                <Card.Content>
                    <RNView style={styles.tableContainer}>
                        <View style={[styles.row, styles.headerRow]}>
                            <View style={[styles.colName, styles.cellBase, styles.headerCell]}>
                                <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">Alimento</Text>
                            </View>
                            <View style={[styles.colGrams, styles.cellBase, styles.headerCell, styles.cellCenter]}>
                                <Text style={styles.headerText}>Grammi</Text>
                            </View>
                            <View style={[styles.colCho, styles.cellBase, styles.headerCell, styles.cellCenter]}>
                                <Text style={styles.headerText}>CHO</Text>
                            </View>
                            <View style={[styles.colActions, styles.headerCell, styles.cellCenter]}>
                                <Text style={styles.headerText}>Azioni</Text>
                            </View>
                        </View>

                        {plate.length === 0 ? (
                            <View style={{ padding: 12 }}>
                                <Text>Il piatto è vuoto</Text>
                            </View>
                        ) : (
                            plate.map((item) => (
                                <View key={String(item.id)} style={styles.row}>
                                    <View style={[styles.colName, styles.cellBase]}>
                                        <Text style={styles.nameText}>{item?.name ?? item?.alimento}</Text>
                                    </View>
                                    <View style={[styles.colGrams, styles.cellBase, styles.cellCenter]}>
                                        <TextInput
                                            mode="flat"
                                            dense
                                            keyboardType="numeric"
                                            value={String(item?.grams ?? 0)}
                                            onChangeText={(t) => onGramsChange(item.id, t)}
                                            style={styles.gramsInput}
                                        />
                                    </View>
                                    <View style={[styles.colCho, styles.cellBase, styles.cellCenter]}>
                                        <Text>{choForItem(item).toFixed(1)}</Text>
                                    </View>
                                    <View style={[styles.colActions, styles.cellCenter]}>
                                        <IconButton
                                            icon="trash-can-outline"
                                            size={20}
                                            onPress={() => remove(item.id)}
                                        />
                                    </View>
                                </View>
                            ))
                        )}


                    </RNView>
                </Card.Content>
                {/* Total row: render without the table cell CSS */}
                <View style={styles.totalContainer}>
                    <Text></Text>
                    <Text style={styles.totalValue}>Totale: {totalCho.toFixed(2)}</Text>
                </View>
            </Card>

            <Button mode="contained" onPress={clearAll} style={{ marginTop: 12 }}>Svuota piatto</Button>
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
    tableContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
    },
    // shared cell base to reduce duplication
    cellBase: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        justifyContent: 'center',
    },
    // header-specific tweaks
    headerCell: {
        paddingVertical: 12,
        backgroundColor: '#f6f6f6',
    },
    // columns
    colName: {
        flex: 1,
        minWidth: 120,
    },
    colGrams: {
        width: 80,
        alignItems: 'center',
    },
    colCho: {
        width: 65,
    },
    colActions: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 0,
    },
    // rows / header / footer
    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerRow: {
        // kept for row-level header styles; cell background moved to headerCell
    },
    // footerRow was removed as Total uses separate container
    headerText: {
        fontWeight: '600',
        fontSize: 14,
    },
    gramsInput: {
        height: 32,
        width: 56,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
    cellCenter: {
        justifyContent: 'center',
    },
    nameText: {
        flexShrink: 1,
        flexWrap: 'wrap',
        lineHeight: 18,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        width: '95%',
        alignSelf: 'center',
    },
    totalValue: {
        fontWeight: '700',
    },
});
