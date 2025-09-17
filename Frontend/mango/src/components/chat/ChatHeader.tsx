import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatHeaderProps {
  userName?: string;
  title?: string;
  showUserInfo?: boolean;
  showMenu?: boolean;
  onBackPress: () => void;
  onProfilePress?: () => void;
  onMenuPress?: () => void;
}

export default function ChatHeader({
  userName,
  title,
  showUserInfo = false,
  showMenu = false,
  onBackPress,
  onProfilePress,
  onMenuPress,
}: ChatHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View
        className="flex-row items-center p-4 border-b border-stroke bg-white"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}
      >
        <TouchableOpacity className="w-6 mr-4" onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#8899A8" />
        </TouchableOpacity>

        {showUserInfo && userName && (
          <TouchableOpacity
            className="flex-1 flex-row items-center"
            onPress={onProfilePress}
          >
            <View className="w-12 h-12 rounded-full bg-mango-red justify-center items-center mr-2">
              <Text className="text-white text-subheading-bold">
                {userName[0]}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-body-medium-semibold text-dark mb-0.5">
                {userName}
              </Text>
              <Text className="text-caption-regular text-text-primary">
                핫플헌터
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {showMenu && (
          <TouchableOpacity className="w-6" onPress={onMenuPress}>
            <Ionicons name="ellipsis-vertical" size={24} color="#8899A8" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
