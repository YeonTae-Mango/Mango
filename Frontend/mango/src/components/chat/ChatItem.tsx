import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChatItemProps {
  chatRoomId: string;
  userName: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  onPress: (chatRoomId: string, userName: string) => void;
}

export default function ChatItem({
  chatRoomId,
  userName,
  lastMessage,
  time,
  unreadCount = 2,
  onPress,
}: ChatItemProps) {
  const getAvatarText = (name: string) => {
    return name.charAt(0);
  };

  return (
    <TouchableOpacity
      className="flex-row items-center px-6 py-4"
      onPress={() => onPress(chatRoomId, userName)}
    >
      <View className="w-16 h-16 rounded-full bg-mango-red justify-center items-center mr-4">
        <Text className="text-white text-subheading-bold">
          {getAvatarText(userName)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-body-medium-semibold mb-2 text-dark">
          {userName}
        </Text>
        <Text
          className="text-body-medium-regular text-text-primary"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {lastMessage}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-body-small-regular text-text-primary mb-2">
          {time}
        </Text>
        {unreadCount > 0 && (
          <View className="bg-mango-red rounded-full min-w-[20px] h-5 justify-center items-center px-1">
            <Text className="text-caption-semibold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
