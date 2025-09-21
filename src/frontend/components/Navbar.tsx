import React from 'react';
import { Box, HStack, Pressable } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Tab = 'calculator' | 'plate' | 'list';

interface NavbarProps {
    selected: Tab;
    onSelect: (tab: Tab) => void;
}

const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: 'calculator', icon: 'calculator-variant', label: 'Calculator' },
    { key: 'plate', icon: 'food', label: 'Plate' },
    { key: 'list', icon: 'format-list-bulleted', label: 'List' },
];

export default function Navbar({ selected, onSelect }: NavbarProps) {
    return (
        <SafeAreaView edges={['bottom']}>
            <Box bg="primary.500" py={2}>
                <HStack justifyContent="space-around">
                    {tabs.map(tab => (
                        <Pressable key={tab.key} onPress={() => onSelect(tab.key)}>
                            <Icon
                                name={tab.icon}
                                size={28}
                                color={selected === tab.key ? 'white' : 'gray'}
                            />
                        </Pressable>
                    ))}
                </HStack>
            </Box>
        </SafeAreaView>
    );
}
