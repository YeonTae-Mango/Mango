import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';

interface TabItem {
  name: string;
  label: string;
  iconFocused: keyof typeof Ionicons.glyphMap;
  iconUnfocused: keyof typeof Ionicons.glyphMap;
}

// 탭 아이템 정보
const TAB_ITEMS: TabItem[] = [
  {
    name: 'Home',
    label: '홈',
    iconFocused: 'home',
    iconUnfocused: 'home-outline',
  },
  {
    name: 'Category',
    label: '카테고리',
    iconFocused: 'grid',
    iconUnfocused: 'grid-outline',
  },
  {
    name: 'Mango',
    label: '망고',
    iconFocused: 'heart',
    iconUnfocused: 'heart-outline',
  },
  {
    name: 'Chat',
    label: '채팅',
    iconFocused: 'chatbubbles',
    iconUnfocused: 'chatbubbles-outline',
  },
  {
    name: 'Profile',
    label: '프로필',
    iconFocused: 'person',
    iconUnfocused: 'person-outline',
  },
];

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="flex-row bg-white pb-2 h-20 safe-area-bottom">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const tabItem = TAB_ITEMS.find(item => item.name === route.name);
        const iconName = isFocused
          ? tabItem?.iconFocused
          : tabItem?.iconUnfocused;
        const label = tabItem?.label || route.name;

        // 탭 아이템 클릭 핸들러
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            className="flex-1 items-center justify-center py-2"
          >
            <View className="items-center">
              <Ionicons
                name={iconName || 'help-outline'}
                size={24}
                color={isFocused ? '#FF6D60' : '#8899A8'}
              />
              <Text
                className={`text-caption-regular mt-1 ${
                  isFocused ? 'text-mango-red' : 'text-text-secondary'
                }`}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
