import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import ProfileCard from '../../components/profile/ProfileCard';

export default function ProfileDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName, fromScreen } = route.params as {
    userName: string;
    fromScreen?: string;
  };

  // 망고 화면에서 온 경우 소비패턴 궁합 보기 버튼 숨김
  const showMatchingButton = fromScreen !== 'Mango';

  // 소비패턴 궁합 보기 버튼 핸들러
  const handleMatchingPattern = () => {
    navigation.navigate('MatchingPattern', { userName });
  };

  // 더미 프로필 데이터 (실제로는 API에서 가져올 데이터)
  const profileData = {
    name: userName,
    age: 28,
    distance: '21km',
    category: '핫플헌터',
    tags: ['카페인중독', '빵순이', '단발병'],
    introduction: '아 씨탈하고 싶다',
    images: [
      'https://postfiles.pstatic.net/MjAyNDA4MDVfMTcx/MDAxNzIyODMzNDI0MzY5.wuG29NRvdZ6kQc0I6xhLTi-AeKIehY4AMD_rvRo6bBog.Aw-JsI21ibU34Wj-YJj-wXoirkPwbTBIT_KyNyzc4hgg.JPEG/IMG_2048.JPG?type=w966',
    ],
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title={`${profileData.name}님의 프로필`}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 프로필 카드 */}
        <ProfileCard
          name={profileData.name}
          age={profileData.age}
          distance={profileData.distance}
          category={profileData.category}
          tags={profileData.tags}
          introduction={profileData.introduction}
          images={profileData.images}
        />

        {/* 하단 정보 및 버튼 영역 */}
        <View className="p-4">
          {/* 정보 박스 */}
          <View className="bg-gray rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={24} color="#000000" />
              <Text className="text-body-large-semibold text-dark ml-2">
                {userName}님은 핫플헌터 유형입니다
              </Text>
            </View>
            <Text className="text-medium-regular text-text-primary leading-5 px-2">
              이것은 핫플헌터에 대한 설명으로 사용자에게 핫플헌터 무엇인지 알려
              정확하고 명확하게 설명해줄 수 있는 텍스트로 구성되어있음. 이것은
              핫플헌터에 대한 설명으로 사용자에게 핫플헌터 무엇인지 알려
              정확하고 명확하게 설명해줄 수 있는 텍스트로 구성되어있음.
            </Text>
          </View>

          {/* 소비패턴 궁합 보기 버튼 */}
          {showMatchingButton && (
            <TouchableOpacity
              className="bg-mango-red rounded-2xl py-4 items-center"
              onPress={handleMatchingPattern}
            >
              <Text className="text-white text-subheading-regular">
                나와의 소비 궁합 보러 가기
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}
