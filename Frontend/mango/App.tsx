import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import TabNavigator from './src/components/common/TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
