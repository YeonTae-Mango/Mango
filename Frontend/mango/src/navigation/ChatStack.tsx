import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import MatchingpatternScreen from '../screens/pattern/MatchingpatternScreen';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';

const Stack = createStackNavigator();

interface ChatStackProps {
  onLogout: () => void;
}

export default function ChatStack({ onLogout }: ChatStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Layout 컴포넌트에서 헤더 처리
      }}
    >
      <Stack.Screen name="ChatList">
        {() => <ChatListScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="MatchingPattern" component={MatchingpatternScreen} />
    </Stack.Navigator>
  );
}
