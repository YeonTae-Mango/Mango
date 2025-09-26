import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';

interface ProfileImageDisplayProps {
  photos: string[];
  onPhotoUpload: () => void;
  onPhotoRemove: (index: number) => void;
}

export default function ProfileImageDisplay({ 
  photos,
  onPhotoUpload,
  onPhotoRemove 
}: ProfileImageDisplayProps) {
  const renderPhotoCard = (photo: string, index: number) => {
    return (
      <View key={index} className="relative w-full h-full rounded-lg bg-mango-red p-[2px]">
        {/* 내부 컨텐츠 래퍼: 실제 모서리 라운드와 클리핑 */}
        <View className="w-full h-full rounded-lg overflow-hidden">
          {/* 실제 이미지 표시 */}
          <Image 
            source={{ uri: photo }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        
        {/* 대표사진 배지 (첫 번째 사진만) */}
        {index === 0 && (
          <View className="absolute top-2 left-2 bg-mango-red px-2 py-1 rounded-md">
            <Text className="text-white text-caption-semibold">대표사진</Text>
          </View>
        )}
        
        {/* 삭제 버튼 */}
        <TouchableOpacity 
          className="absolute top-1 right-1 bg-black rounded-full w-7 h-7 items-center justify-center"
          onPress={() => onPhotoRemove(index)}
        >
          <Text className="text-white text-lg font-bold">×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddCard = () => {
    return (
      <TouchableOpacity 
        className="relative w-full h-full border-2 border-dashed border-stroke rounded-lg items-center justify-center bg-gray-100"
        onPress={onPhotoUpload}
      >
        <Text className="text-gray-400 text-4xl">+</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      <View className="flex-row flex-wrap justify-between">
        {/* 업로드된 사진들 렌더링 */}
        {photos.map((photo, index) => (
          <View key={index} className="w-[48%] aspect-square mb-4">
            {renderPhotoCard(photo, index)}
          </View>
        ))}
        
        {/* + 카드 (4개 미만일 때만 표시, 항상 1개만) */}
        {photos.length < 4 && (
          <View className="w-[48%] aspect-square mb-4">
            {renderAddCard()}
          </View>
        )}
        
      </View>
    </View>
  );
}
