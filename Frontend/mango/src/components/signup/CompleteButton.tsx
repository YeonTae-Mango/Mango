import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CompleteButtonProps {
  isActive: boolean;
  onPress: () => void;
  text: string;
  disabled?: boolean;
}

export default function CompleteButton({
  isActive,
  onPress,
  text,
  disabled = false,
}: CompleteButtonProps) {
  return (
    <View className="flex-1 justify-end pb-40">
      <TouchableOpacity
        className={`h-14 rounded-xl justify-center items-center ${
          isActive ? 'bg-mango-red' : 'bg-stroke'
        }`}
        onPress={onPress}
        disabled={!isActive || disabled}
      >
        <Text
          className={`text-base font-semibold ${
            isActive ? 'text-white' : 'text-secondary'
          }`}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
