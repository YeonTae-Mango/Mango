import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/common/Layout';

interface ProfileScreenProps {
  onLogout?: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const navigation = useNavigation<any>();

  const handleProfileEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleMyPattern = () => {
    navigation.navigate('MyPattern');
  };

  const mockProfileData = {
    name: '나나',
    age: 28,
    gender: '여',
    introduction: '아 싸탈하고 싶다',
    profileImage:
      'https://img.news-wa.com//img/upload/2025/01/15/NWC_20250115215332.jpg.webp',
    consumerType: '핫플레이서',
    hashtags: ['#카페인중독', '#인터넷쇼핑', '#단발병'],
    description:
      '이것은 핫플레이서에 대한 설명으로 사용자에게 핫플레이서가 무엇인지를 정확하고 명확하게 설명해줄 수 있는 텍스트로 구성되어있습니다만 현재 시각이 2시인 관계로 저는 이를 목적적합하게 작이넹 자신이 없어서 이렇게 제 자신에 대한 부끄러움을 글로 옮기는 것으로 이 업무를 마무리하려고 합니다.',
  };

  return (
    <Layout onLogout={onLogout} showBottomSafeArea={false}>
      <ScrollView className="flex-1 bg-white px-6 py-4">
        {/* 상단 헤더 */}
        <View className="flex-row justify-between items-center px-2">
          <Text className="text-subheading-bold text-dark">프로필</Text>
          <TouchableOpacity onPress={handleProfileEdit}>
            <Text className="text-body-medium-semibold text-text-primary">
              수정
            </Text>
          </TouchableOpacity>
        </View>

        {/* 프로필 정보 섹션 */}
        <View className="mt-6 mb-10 px-6 py-4 bg-gray rounded-2xl">
          {/* 프로필 이미지와 정보를 가로로 배치 */}
          <View className="flex-row items-center">
            {/* 프로필 이미지 */}
            <View className="w-24 h-24 rounded-full overflow-hidden mr-6">
              <Image
                source={{ uri: mockProfileData.profileImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* 이름, 나이, 성별과 소개글 */}
            <View className="flex-1">
              <Text className="text-subheading-bold text-gray-900 mb-2">
                {mockProfileData.name} ({mockProfileData.age}){' '}
              </Text>
              <Text className="text-body-large-regular text-text-primary">
                {mockProfileData.introduction}
              </Text>
            </View>
          </View>
        </View>

        {/* 소비패턴 섹션 */}
        <View className="mb-6">
          <Text className="text-subheading-bold text-dark px-2 mb-6">
            소비패턴
          </Text>

          {/* 소비자 유형 */}
          <View className="bg-blue-100 rounded-full px-6 py-4 flex-row items-center mb-4">
            <Ionicons
              name="location"
              size={20}
              color="#EF4444"
              className="mr-2"
            />
            <Text className="text-body-large-semibold">
              당신은 {mockProfileData.consumerType} 유형입니다
            </Text>
          </View>

          {/* 설명 텍스트 */}
          <Text className="text-text-primary text-body-small-regular px-4 leading-5 mb-4">
            {mockProfileData.description}
          </Text>

          {/* 해시태그 */}
          <View className="flex-row flex-wrap mb-6 px-4">
            {mockProfileData.hashtags.map((tag, index) => (
              <View
                key={index}
                className="bg-gray rounded-full px-4 py-2 mr-2 mb-2"
              >
                <Text className="text-text-primary text-body-medium-semibold">
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* 소비패턴 분석 버튼 */}
          <TouchableOpacity
            className="bg-red-400 rounded-2xl py-4 items-center"
            onPress={handleMyPattern}
          >
            <Text className="text-white text-base font-semibold">
              나의 소비패턴 분석
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
}
