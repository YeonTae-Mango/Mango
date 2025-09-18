import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface ProfileUploadFormProps {
  photos: string[];
  onPhotoUpload: () => void;
  onPhotoRemove: (index: number) => void;
}

export default function ProfileUploadForm({ 
  photos,
  onPhotoUpload,
  onPhotoRemove 
}: ProfileUploadFormProps) {
  const renderPhotoCard = (photo: string, index: number) => {
    return (
      <View key={index} className="relative w-full h-full rounded-lg border-2 border-mango-red">
        {/* 회색 배경 (지도처럼) */}
        <View className="w-full h-full bg-gray-400 items-center justify-center rounded-lg overflow-hidden">
          <Text className="text-white text-lg font-semibold">사진</Text>
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
        
        {/* 빈 공간 (홀수 개일 때 레이아웃 유지) */}
        {photos.length % 2 === 1 && photos.length < 4 && (
          <View className="w-[48%] aspect-square mb-4" />
        )}
      </View>
    </View>
  );
}
