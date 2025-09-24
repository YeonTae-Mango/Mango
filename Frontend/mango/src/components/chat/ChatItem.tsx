import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ChatItemProps {
  chatRoomId: string;
  userName: string;
  profileImageUrl?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isBlocked?: boolean;
  onPress: (chatRoomId: string, userName: string) => void;
}

export default function ChatItem({
  chatRoomId,
  userName,
  profileImageUrl,
  lastMessage,
  time,
  unreadCount = 0,
  isBlocked = false,
  onPress,
}: ChatItemProps) {
  const getAvatarText = (name: string) => {
    return name.charAt(0);
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center px-6 py-4 ${isBlocked ? 'bg-gray-100 opacity-70' : ''}`}
      onPress={() => onPress(chatRoomId, userName)}
    >
      {profileImageUrl ? (
        <Image
          source={{ uri: profileImageUrl }}
          className="w-16 h-16 rounded-full mr-4"
          resizeMode="cover"
        />
      ) : (
        <View
          className={`w-16 h-16 rounded-full justify-center items-center mr-4 ${isBlocked ? 'bg-gray-400' : 'bg-mango-red'}`}
        >
          <Text className="text-white text-subheading-bold">
            {getAvatarText(userName)}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text
          className={`text-body-medium-semibold mb-2 ${isBlocked ? 'text-gray-500' : 'text-dark'}`}
        >
          {userName}
        </Text>
        <Text
          className={`text-body-medium-regular ${isBlocked ? 'text-gray-400' : 'text-text-primary'}`}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {isBlocked ? '차단된 사용자입니다.' : lastMessage}
        </Text>
      </View>
      <View className="items-end">
        <Text
          className={`text-body-small-regular mb-2 ${isBlocked ? 'text-gray-400' : 'text-text-primary'}`}
        >
          {time}
        </Text>
        {!isBlocked && unreadCount > 0 && (
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
