import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface LocationFormProps {
  city: string;
  district: string;
  onCityPress: () => void;
  onDistrictPress: () => void;
}

export default function LocationForm({ 
  city, 
  district, 
  onCityPress, 
  onDistrictPress 
}: LocationFormProps) {
  return (
    <View className="flex-1 pt-20">
      {/* 안내 문구 */}
      <View className="mb-16">
        <Text className="text-heading-bold text-text-primary text-center">
          이 위치가 맞나요?
        </Text>
      </View>

      {/* 지도 영역 */}
      <View className="flex-1 mb-8">
        <View className="flex-1 bg-gray rounded-xl justify-center items-center">
          <Text className="text-xl text-secondary font-semibold">지도</Text>
        </View>
      </View>

      {/* 시/군/구 선택 버튼들 */}
      <View className="flex-row gap-4 mb-8">
        {/* 시/도 버튼 */}
        <TouchableOpacity
          className="flex-1 h-14 bg-gray rounded-xl justify-center items-center"
          onPress={onCityPress}
        >
          <Text className={`text-base font-semibold ${
            city ? 'text-text-primary' : 'text-secondary'
          }`}>
            {city || '시/도'}
          </Text>
        </TouchableOpacity>

        {/* 구/군 버튼 */}
        <TouchableOpacity
          className="flex-1 h-14 bg-gray rounded-xl justify-center items-center"
          onPress={onDistrictPress}
        >
          <Text className={`text-base font-semibold ${
            district ? 'text-text-primary' : 'text-secondary'
          }`}>
            {district || '구/군'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
