import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

// 화면 컴포넌트들
import ChatStack from '../../navigation/ChatStack';
import CategoryScreen from '../../screens/CategoryScreen';
import HomeScreen from '../../screens/HomeScreen';
import MangoScreen from '../../screens/MangoScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Category') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Mango') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6D60',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{ tabBarLabel: '카테고리' }}
      />
      <Tab.Screen
        name="Mango"
        component={MangoScreen}
        options={{ tabBarLabel: '망고' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ tabBarLabel: '채팅' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: '프로필' }}
      />
    </Tab.Navigator>
  );
}
