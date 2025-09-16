import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 화면 컴포넌트들
import TabBar from '../components/common/TabBar';
import HomeScreen from '../screens/home/HomeScreen';
import CategoryStack from './CategoryStack';
import ChatStack from './ChatStack';
import MangoStack from './MangoStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  onLogout: () => void;
}

export default function TabNavigator({ onLogout }: TabNavigatorProps) {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" options={{ tabBarLabel: '홈' }}>
        {() => <HomeScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Category" options={{ tabBarLabel: '카테고리' }}>
        {() => <CategoryStack onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Mango" options={{ tabBarLabel: '망고' }}>
        {() => <MangoStack onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" options={{ tabBarLabel: '채팅' }}>
        {() => <ChatStack onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ tabBarLabel: '프로필' }}>
        {() => <ProfileStack onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
