import React from 'react';
import { Text, View } from 'react-native';

interface SignupDescriptionProps {
  description: string;
}

export default function SignupDescription({ description }: SignupDescriptionProps) {
  return (
    <View className="mb-16">
      <Text className="text-body-large-regular text-text-primary text-center leading-6">
        {description}
      </Text>
    </View>
  );
}
