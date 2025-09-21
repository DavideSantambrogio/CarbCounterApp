import React, { useState } from 'react';
import { NativeBaseProvider, Box, Text } from 'native-base';
import Navbar, { Tab } from './src/frontend/components/Navbar';

export default function App() {
  const [selectedTab, setSelectedTab] = useState<Tab>('calculator');

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="white">
        <Box flex={1} alignItems="center" justifyContent="center">
          {selectedTab === 'calculator' && <Text fontSize="xl">Calculator</Text>}
          {selectedTab === 'plate' && <Text fontSize="xl">Plate</Text>}
          {selectedTab === 'list' && <Text fontSize="xl">List</Text>}
        </Box>
        <Navbar selected={selectedTab} onSelect={setSelectedTab} />
      </Box>
    </NativeBaseProvider>
  );
}

// npx react-native start --reset-cache
