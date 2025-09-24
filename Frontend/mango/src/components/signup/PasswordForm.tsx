import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface PasswordFormProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  error?: string;
}

export default function PasswordForm({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  error,
}: PasswordFormProps) {
  return (
    <View className="flex-1 pt-10">
      {/* 안내 문구 */}
      <View className="mb-16">
        <Text className="text-heading-bold text-text-primary text-center">
          비밀번호를 작성해주세요
        </Text>
      </View>

      {/* 입력 필드 */}
      <View>
        <TextInput
          className="h-14 bg-gray rounded-xl px-4 text-base"
          placeholder="비밀번호"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* 비밀번호 확인 필드 */}
        <TextInput
          className="h-14 bg-gray rounded-xl px-4 text-base mt-4"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error && (
          <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>
        )}
      </View>
    </View>
  );
}
