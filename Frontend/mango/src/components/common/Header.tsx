import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title?: string;
  onLogout?: () => void; // 로그아웃 콜백 함수
}

export default function Header({ title = 'mango', onLogout }: HeaderProps) {
  const navigation = useNavigation<any>();

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleSettingsPress = () => {
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
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100 pt-12">
        <Text className="text-heading-bold text-mango-red">{title}</Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleNotificationPress}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#333"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
