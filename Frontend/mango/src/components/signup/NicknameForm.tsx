import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface NicknameFormProps {
  nickname: string;
  onNicknameChange: (nickname: string) => void;
  error?: string;
}

export default function NicknameForm({ 
  nickname, 
  onNicknameChange, 
  error
}: NicknameFormProps) {
  return (
    <View className="flex-1 pt-10">
      {/* 안내 문구 */}
      <View className="mb-16">
        <Text className="text-heading-bold text-text-primary text-center">
          닉네임을 작성해주세요
        </Text>
      </View>

      {/* 입력 필드 */}
      <View>
        <TextInput
          className="h-14 bg-gray rounded-xl px-4 text-base"
          placeholder="닉네임"
          value={nickname}
          onChangeText={onNicknameChange}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={10}
        />
        {error && (
          <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>
        )}
        {/* 글자 수 표시 */}
        <Text className="text-text-secondary text-sm mt-2 ml-1">
          {nickname.length}/10
        </Text>
      </View>
    </View>
  );
}
