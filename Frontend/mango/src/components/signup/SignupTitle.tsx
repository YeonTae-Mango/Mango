import React from 'react';
import { Text, View } from 'react-native';

interface SignupTitleProps {
  title: string;
}

export default function SignupTitle({ title }: SignupTitleProps) {
  return (
    <View className="mb-8">
      <Text className="text-heading-bold text-text-primary text-center">
        {title}
      </Text>
    </View>
  );
}
