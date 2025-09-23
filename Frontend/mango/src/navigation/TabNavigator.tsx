import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// 화면 컴포넌트들
import TabBar from '../components/common/TabBar';
import CategoryScreen from '../screens/category/CategoryScreen';
import CategorySwipeScreen from '../screens/category/CategorySwipeScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MangoScreen from '../screens/mango/MangoScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const CategoryStack = createStackNavigator();

// Category 탭 내부의 Stack Navigator
function CategoryStackNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <CategoryStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CategoryStack.Screen name="CategoryMain" component={CategoryScreen} />
      <CategoryStack.Screen
        name="CategorySwipe"
        component={CategorySwipeScreen}
      />
    </CategoryStack.Navigator>
  );
}

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
        {() => <CategoryStackNavigator onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Mango" options={{ tabBarLabel: '망고' }}>
        {() => <MangoScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" options={{ tabBarLabel: '채팅' }}>
        {() => <ChatListScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ tabBarLabel: '프로필' }}>
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
