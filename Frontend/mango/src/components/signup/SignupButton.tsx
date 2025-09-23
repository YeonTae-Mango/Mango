import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SignupButtonProps {
  isActive: boolean;
  onPress: () => void;
  text: string;
  disabled?: boolean;
}

export default function SignupButton({
  isActive,
  onPress,
  text,
  disabled = false,
}: SignupButtonProps) {
  const isDisabled = !isActive || disabled;

  return (
    <View className="pb-40">
      <TouchableOpacity
        className={`h-14 rounded-xl justify-center items-center ${
          isDisabled ? 'bg-stroke' : 'bg-mango-red'
        }`}
        onPress={onPress}
        disabled={isDisabled}
      >
        <Text
          className={`text-base font-semibold ${
            isDisabled ? 'text-secondary' : 'text-white'
          }`}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
