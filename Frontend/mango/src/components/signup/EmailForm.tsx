import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface EmailFormProps {
  value: string;
  onChangeText: (value: string) => void;
}

export default function EmailForm({ value, onChangeText }: EmailFormProps) {
  return (
    <View className="flex-1 pt-10">
      {/* 안내 문구 */}
      <View className="mb-16">
        <Text className="text-heading-bold text-text-primary text-center">
          이메일을 작성해주세요
        </Text>
      </View>

      {/* 입력 필드 */}
      <View>
        <TextInput
          className="h-14 bg-gray rounded-xl px-4 text-base"
          placeholder="이메일"
          value={value}
          onChangeText={onChangeText}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
