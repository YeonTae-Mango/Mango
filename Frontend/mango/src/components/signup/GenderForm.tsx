import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface GenderFormProps {
  selectedGender: 'M' | 'F' | '';
  onGenderSelect: (gender: 'M' | 'F') => void;
}

export default function GenderForm({
  selectedGender,
  onGenderSelect,
}: GenderFormProps) {
  return (
    <View className="flex-1 pt-10">
      {/* 안내 문구 */}
      <View className="mb-16">
        <Text className="text-heading-bold text-text-primary text-center">
          성별을 알려주세요
        </Text>
      </View>

      {/* 성별 선택 버튼들 */}
      <View className="flex-row justify-center gap-4">
        {/* 남자 버튼 */}
        <TouchableOpacity
          className={`h-14 px-16 rounded-xl justify-center items-center ${
            selectedGender === 'M' ? 'bg-mango-red' : 'bg-gray'
          }`}
          onPress={() => onGenderSelect('M')}
        >
          <Text
            className={`text-xl font-semibold ${
              selectedGender === 'M' ? 'text-white' : 'text-text-primary'
            }`}
          >
            남자
          </Text>
        </TouchableOpacity>

        {/* 여자 버튼 */}
        <TouchableOpacity
          className={`h-14 px-16 rounded-xl justify-center items-center ${
            selectedGender === 'F' ? 'bg-mango-red' : 'bg-gray'
          }`}
          onPress={() => onGenderSelect('F')}
        >
          <Text
            className={`text-xl font-semibold ${
              selectedGender === 'F' ? 'text-white' : 'text-text-primary'
            }`}
          >
            여자
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
