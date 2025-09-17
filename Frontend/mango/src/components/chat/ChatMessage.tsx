import React from 'react';
import { Text, View } from 'react-native';

interface ChatMessageProps {
  message: string;
  time: string;
  isMyMessage: boolean;
  isRead?: boolean;
}

export default function ChatMessage({
  message,
  time,
  isMyMessage,
  isRead = true,
}: ChatMessageProps) {
  return (
    <View className="mb-4 px-4">
      <View
        className={`flex-row items-end ${
          isMyMessage ? 'justify-end' : 'justify-start'
        }`}
      >
        {isMyMessage ? (
          // 내 메시지 (오른쪽)
          <View className="flex-row items-end max-w-[75%]">
            <View className="flex-col items-end mr-2 flex-shrink-0">
              <Text className="text-caption-regular text-text-secondary">
                {time}
              </Text>
            </View>
            <View className="bg-mango-red rounded-2xl rounded-br-md px-4 py-3 flex-shrink">
              <Text className="text-white text-body-medium-regular leading-5">
                {message}
              </Text>
            </View>
          </View>
        ) : (
          // 상대방 메시지 (왼쪽)
          <View className="flex-row items-end max-w-[75%]">
            <View className="bg-gray rounded-2xl rounded-bl-md px-4 py-3 flex-shrink">
              <Text className="text-text-primary text-body-medium-regular leading-5">
                {message}
              </Text>
            </View>
            <View className="flex-col items-start ml-2 flex-shrink-0">
              <Text className="text-caption-regular text-text-secondary">
                {time}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
