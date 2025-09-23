import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MangoUser } from '../../types/mango';

interface MangoCardProps {
  user: MangoUser;
  onPress: (userName: string, userId?: number, userInfo?: MangoUser) => void;
}

export default function MangoCard({ user, onPress }: MangoCardProps) {
  return (
    <TouchableOpacity
      className="w-[48%] mb-4 bg-white rounded-2xl overflow-hidden"
      style={{ aspectRatio: 0.65 }}
      onPress={() => onPress(user.nickname, user.userId, user)}
    >
      <View className="flex-1 relative">
        {/* 프로필 이미지 영역 */}
        <Image
          source={{
            uri: user.profileUrl,
          }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* 그라디언트 오버레이 */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          locations={[0, 0.6, 1]}
          className="absolute bottom-0 left-0 right-0 h-2/3"
        />

        {/* 위치 정보 */}
        <View className="absolute top-2 right-2">
          <View className="bg-black/30 rounded-full px-3 py-1.5 flex-row items-center">
            <Ionicons name="location-outline" size={14} color="white" />
            <Text className="text-white text-body-small-regular ml-1">
              {user.sigungu}
            </Text>
          </View>
        </View>

        {/* 하단 정보 */}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          {/* 이름과 나이 */}
          <View className="flex-row items-center mb-2">
            <Text className="text-white text-subheading-bold">
              {user.nickname}{' '}
              <Text className="text-subheading-bold">{user.age}</Text>
            </Text>
          </View>

          {/* 카테고리 */}
          <View className="flex-row">
            <View className="bg-mango-red/80 rounded-full px-3 py-1.5 flex-row items-center">
              <Ionicons name="flame-outline" size={16} color="white" />
              <Text className="text-body-medium-semibold text-white ml-1">
                {user.mainType || '일반'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
