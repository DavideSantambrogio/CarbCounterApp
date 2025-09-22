
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface NavbarProps {
    index: number;
    setIndex: (index: number) => void;
    routes: { key: string; title: string; icon: string }[];
    renderScene: (props: { route: { key: string; title: string; icon: string } }) => React.ReactNode;
}

export default function Navbar({ index, setIndex, routes, renderScene }: NavbarProps) {
    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            renderIcon={({ route, color }) => (
                <Icon name={route.icon} color={color} size={28} />
            )}
            barStyle={styles.bar}
        />
    );
}

const styles = StyleSheet.create({
    bar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        elevation: 8,
    },
});
