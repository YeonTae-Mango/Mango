import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, CategoryType } from '../../constants/category';

interface ProfileCardProps {
  name: string;
  age: number;
  distance: string;
  category: string;
  tags?: string[];
  introduction?: string;
  images?: string[];
  showDistance?: boolean;
}

export default function ProfileCard({
  name,
  age,
  distance,
  category,
  tags = [],
  introduction = '',
  images = [],
  showDistance = true,
}: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 메인 타입으로 카테고리 정보 찾기
  const getCategoryInfo = (mainType: string) => {
    const categoryKey = Object.keys(CATEGORIES).find(
      key => CATEGORIES[key as CategoryType].name === mainType
    ) as CategoryType;

    return categoryKey ? CATEGORIES[categoryKey] : null;
  };

  // 더미 이미지 (이미지가 없을 경우)
  const defaultImage =
    'https://postfiles.pstatic.net/MjAyNDA4MDVfMTcx/MDAxNzIyODMzNDI0MzY5.wuG29NRvdZ6kQc0I6xhLTi-AeKIehY4AMD_rvRo6bBog.Aw-JsI21ibU34Wj-YJj-wXoirkPwbTBIT_KyNyzc4hgg.JPEG/IMG_2048.JPG?type=w966';
  const displayImages = images.length > 0 ? images : [defaultImage];
  const maxImages = displayImages.length;

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? maxImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === maxImages - 1 ? 0 : prev + 1));
  };

  return (
    <View className="flex-1 bg-white py-2" style={{ aspectRatio: 0.65 }}>
      {/* 프로필 영역 */}
      <View className="flex-1 flex-row items-center justify-center relative">
        {/* 그라디언트 오버레이 영역 */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          locations={[0, 0.5, 1]}
          className="absolute bottom-0 left-0 right-0 h-full z-10"
        />

        {/* 프로그레스 바 오버레이 영역 - 사진이 2장 이상일 때만 표시 */}
        {maxImages > 1 && (
          <View className="absolute top-4 left-0 right-0 flex-row justify-center z-20">
            {Array.from({ length: maxImages }).map((_, idx) => (
              <View
                key={idx}
                className={`h-1 rounded mx-1 ${currentImageIndex === idx ? 'w-10 bg-white' : 'w-8 bg-white/30'}`}
              />
            ))}
          </View>
        )}

        {/* 이미지 슬라이더 영역 */}
        <TouchableOpacity
          className="absolute left-0 w-[50%] h-full z-20"
          onPress={handlePrevImage}
        />
        <Image
          source={{ uri: displayImages[currentImageIndex] }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute right-0 w-[50%] h-full z-20"
          onPress={handleNextImage}
        />

        {/* 프로필 정보 오버레이 영역 */}
        <View className="absolute bottom-10 left-0 right-0 px-5 z-20">
          <View className="flex-row items-center mb-3 ml-1">
            {/* 거리 */}
            {showDistance && (
              <View className="bg-mango-primary rounded-full px-4 py-1.5 flex-row items-center self-start mr-2">
                <Ionicons name="location-outline" size={14} color="white" />
                <Text className="text-body-small-semibold text-white ml-2">
                  {distance}
                </Text>
              </View>
            )}
          </View>

          {/* 이름 나이 & 유형 */}
          <View className="flex-row items-center mb-3 ml-1">
            <Text className="text-heading-bold text-white mr-4">
              {name} <Text>{age}</Text>
            </Text>
            <View className="bg-mango-red/80 rounded-full px-4 py-1 flex-row items-center">
              <Text className="text-lg">
                {getCategoryInfo(category)?.emoji || '❓'}
              </Text>
              <Text className="text-body-large-regular text-white ml-2">
                {category}
              </Text>
            </View>
          </View>

          {/* 해시태그 */}
          {tags.length > 0 && (
            <View className="flex-row flex-wrap mb-3">
              {tags.map((tag, idx) => (
                <Text
                  key={idx}
                  className="bg-white/20 rounded-full px-4 py-1.5 mr-2 text-small-semibold text-white"
                >
                  # {tag}
                </Text>
              ))}
            </View>
          )}

          {/* 소개말 */}
          {introduction && (
            <View className="ml-1">
              <Text className="text-body-small-regular text-white">
                {introduction}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
