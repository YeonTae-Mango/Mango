import React from 'react';
import { Text, View } from 'react-native';

interface ChatDateSeparatorProps {
  date: string;
}

export default function ChatDateSeparator({ date }: ChatDateSeparatorProps) {
  return (
    <View className="items-center my-4 px-4">
      <View>
        <Text className="text-caption-regular text-text-primary">{date}</Text>
      </View>
    </View>
  );
}
