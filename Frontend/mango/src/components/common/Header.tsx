import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  onLogout?: () => void; // 로그아웃 콜백 함수
}

export default function Header({ onLogout }: HeaderProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // 알림 아이콘 클릭 핸들러
  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };
  // 로그아웃 아이콘 클릭 핸들러
  const handleLogoutPress = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View
        className="flex-row items-center justify-between p-4 bg-white"
        style={{ paddingTop: Math.max(insets.top, 16) + 16 }} // 상단 안전 영역 + 추가 패딩
      >
        <Text className="text-heading-bold text-mango-red">mango</Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleNotificationPress}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#8899A8"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogoutPress}>
            <Ionicons name="log-out-outline" size={24} color="#8899A8" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
