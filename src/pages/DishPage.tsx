import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, TextInput, IconButton } from 'react-native-paper';
import { View as RNView } from 'react-native';
import { getPlateApi, removeFromPlateApi, clearPlateApi, subscribePlateApi, updatePlateItemApi } from '../backend/api/plateApi';
import ConfirmModal from '../components/ConfirmModal';
import globalStyles from '../styles/globalStyles';

export default function DishPage() {
    const [plate, setPlate] = useState<any[]>([]);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState<string | undefined>(undefined);
    const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);

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

    const confirmRemove = (id: string) => {
        setConfirmMessage('Sei sicuro di voler rimuovere questo alimento dal piatto?');
        setConfirmAction(() => async () => { await remove(id); });
        setConfirmVisible(true);
    };

    const clearAll = async () => {
        await clearPlateApi();
        await load();
    };

    const confirmClearAll = () => {
        setConfirmMessage('Sei sicuro di voler svuotare il piatto?');
        setConfirmAction(() => async () => { await clearAll(); });
        setConfirmVisible(true);
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
            <Card style={styles.cardFull}>
                <Card.Content style={styles.cardContent}>
                    {/* header row */}
                    <View style={[styles.row, styles.headerRow]}>
                        <View style={[styles.colName, styles.cellBase, styles.headerCell]}>
                            <Text style={[styles.headerText, globalStyles.subtitle]} numberOfLines={1} ellipsizeMode="tail">Alimento</Text>
                        </View>
                        <View style={[styles.colGrams, styles.cellBase, styles.headerCell, styles.cellCenter]}>
                            <Text style={[styles.headerText, globalStyles.subtitle]}>Grammi</Text>
                        </View>
                        <View style={[styles.colCho, styles.cellBase, styles.headerCell, styles.cellCenter]}>
                            <Text style={[styles.headerText, globalStyles.subtitle]}>CHO</Text>
                        </View>
                        <View style={[styles.colActions, styles.headerCell, styles.cellCenter]}>
                            <Text style={[styles.headerText, globalStyles.subtitle]}>Azioni</Text>
                        </View>
                    </View>

                    {/* scrollable table body */}
                    <ScrollView style={styles.scrollArea} contentContainerStyle={{ flexGrow: 1 }}>
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
                                            onPress={() => confirmRemove(item.id)}
                                        />
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </Card.Content>
            </Card>

            <Text style={styles.totalValue}>Totale: {totalCho.toFixed(2)}</Text>

            <Button mode="contained" onPress={confirmClearAll} disabled={plate.length === 0}>Svuota piatto</Button>
            <ConfirmModal
                visible={confirmVisible}
                title="Conferma"
                message={confirmMessage}
                onDismiss={() => { setConfirmVisible(false); setConfirmAction(null); }}
                onConfirm={async () => {
                    setConfirmVisible(false);
                    try {
                        if (confirmAction) await confirmAction();
                    } finally {
                        setConfirmAction(null);
                    }
                }}
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
        width: '95%',
        textAlign: 'right',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    cardFull: {
        width: '95%',
        maxHeight: '75%',
        alignSelf: 'center',
        borderRadius: 6,
    },
    cardContent: {
        padding: 0,
    },
    scrollArea: {
        maxHeight: '90%',
    },
    footerBar: {

    },
});
