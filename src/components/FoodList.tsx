import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import { Food } from '../types/Food';

type Props = {
    items: Food[];
    plateItems: Food[];
    onAddToPlate: (item: Food) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
};

export default function FoodList({ items, plateItems, onAddToPlate, onLoadMore, hasMore }: Props) {
    return (
        <FlatList
            data={items}
            contentContainerStyle={{ padding: 15 }}
            keyExtractor={(item) => String((item as any).id)}
            renderItem={({ item }) => (
                <Card style={[{ marginVertical: 6 }, styles.cardFixed]}>
                    <Card.Content>
                        <Text style={{ fontSize: 18 }}>{(item as any).name ?? (item as any).alimento}</Text>
                        <Paragraph>Carboidrati: {(item as any).carbs ?? (item as any).cho}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => onAddToPlate(item)} disabled={!!plateItems.find(p => String(p.id) === String((item as any).id))}>
                            Aggiungi al piatto
                        </Button>
                    </Card.Actions>
                </Card>
            )}
            ListEmptyComponent={() => (
                <Text>Nessun elemento. Premi "Aggiungi esempio" per crearne uno.</Text>
            )}
            ListFooterComponent={() => (
                hasMore ? (
                    <Button mode="outlined" onPress={onLoadMore} style={{ marginVertical: 12 }}>
                        Vedi altro
                    </Button>
                ) : null
            )}
            onEndReachedThreshold={0.5}
        />
    );
}

const styles = StyleSheet.create({
    cardFixed: {
        width: 280,
        alignSelf: 'center',
    },
});
