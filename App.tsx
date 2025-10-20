/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { Provider as PaperProvider, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MenuPage from './src/pages/MenuPage';
import DishPage from './src/pages/DishPage';
import AdminPage from './src/pages/AdminPage';

const MenuRoute = () => <MenuPage />;
const DishRoute = () => <DishPage />;
const ListRoute = () => <AdminPage />;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'menu', title: 'Menù', icon: 'silverware-fork-knife' },
    { key: 'dish', title: 'Piatto', icon: 'food' },
    { key: 'list', title: 'Admin', icon: 'shield-account' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    menu: MenuRoute,
    dish: DishRoute,
    list: ListRoute,
  });

  return (
    <PaperProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={({ route, color }) => (
          <Icon name={route.icon} color={color} size={24} />
        )}
        barStyle={styles.bar}
      />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#fff',
    elevation: 8,
  },
});

export default App;
