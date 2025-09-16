import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SignupButtonProps {
  isActive: boolean;
  onPress: () => void;
  text: string;
}

export default function SignupButton({ isActive, onPress, text }: SignupButtonProps) {
  return (
    <View className="pb-20">
      <TouchableOpacity
        className={`h-14 rounded-xl justify-center items-center ${
          isActive ? 'bg-mango-red' : 'bg-stroke'
        }`}
        onPress={onPress}
        disabled={!isActive}
      >
        <Text className={`text-base font-semibold ${
          isActive ? 'text-white' : 'text-secondary'
        }`}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
