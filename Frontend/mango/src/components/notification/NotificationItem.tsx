import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NotificationData, NotificationType } from '../../types/notification';

export interface NotificationItemProps extends NotificationData {
  onPress?: (notification: NotificationData) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.NEW_MATCH:
      return (
        <View className="w-12 h-12 bg-mango-red rounded-full items-center justify-center">
          <Ionicons name="heart" size={20} color="white" />
        </View>
      );
    case NotificationType.NEW_MESSAGE:
      return (
        <View className="w-12 h-12 bg-mango-red rounded-full items-center justify-center">
          <Ionicons name="chatbubble" size={20} color="white" />
        </View>
      );
    case NotificationType.MANGO_RECEIVED:
      return (
        <View className="w-12 h-12 bg-mango-red rounded-full items-center justify-center">
          <Ionicons name="heart-outline" size={20} color="white" />
        </View>
      );
    case NotificationType.MYDATA_CONNECTED:
      return (
        <View className="w-12 h-12 bg-mango-red rounded-full items-center justify-center">
          <Ionicons name="information-circle" size={20} color="white" />
        </View>
      );
    default:
      return (
        <View className="w-12 h-12 bg-mango-red rounded-full items-center justify-center">
          <Ionicons name="notifications" size={20} color="white" />
        </View>
      );
  }
};

export default function NotificationItem({
  id,
  type,
  title,
  subtitle,
  time,
  userId,
  chatRoomId,
  onPress,
}: NotificationItemProps) {
  const handlePress = () => {
    if (onPress) {
      onPress({
        id,
        type,
        title,
        subtitle,
        time,
        userId,
        chatRoomId,
      });
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center px-6 py-5 border-b border-stroke"
      onPress={handlePress}
    >
      {/* 아이콘 */}
      <View className="mr-4">{getNotificationIcon(type)}</View>

      {/* 콘텐츠 */}
      <View className="flex-1">
        <Text className="text-body-medium-semibold text-dark mb-1">
          {title}
        </Text>
        <Text className="text-body-small-regular text-text-primary">
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
