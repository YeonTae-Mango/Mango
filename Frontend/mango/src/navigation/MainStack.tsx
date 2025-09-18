import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CategorySwipeScreen from '../screens/category/CategorySwipeScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import MatchingpatternScreen from '../screens/pattern/MatchingpatternScreen';
import MyPatternScreen from '../screens/profile/MyPatternScreen';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';
import ProfileEditScreen from '../screens/profile/ProfileEditScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

interface MainStackProps {
  onLogout: () => void;
}

export default function MainStack({ onLogout }: MainStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 메인 탭 네비게이터 - TabBar가 표시됨 */}
      <Stack.Screen name="Main">
        {() => <TabNavigator onLogout={onLogout} />}
      </Stack.Screen>

      {/* 상세 화면들 - TabBar가 숨겨짐 */}
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="MyPattern" component={MyPatternScreen} />
      <Stack.Screen name="MatchingPattern" component={MatchingpatternScreen} />
      <Stack.Screen name="CategorySwipe" component={CategorySwipeScreen} />
    </Stack.Navigator>
  );
}
