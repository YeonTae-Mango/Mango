import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getCurrentUserId, getUserById } from '../../api/auth';
import Layout from '../../components/common/Layout';
import { CATEGORIES, CategoryType } from '../../constants/category';

interface ProfileScreenProps {
  onLogout?: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const navigation = useNavigation<any>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 메인 타입으로 카테고리 정보 찾기
  const getCategoryInfo = (mainType: string) => {
    const categoryKey = Object.keys(CATEGORIES).find(
      key => CATEGORIES[key as CategoryType].name === mainType
    ) as CategoryType;

    return categoryKey ? CATEGORIES[categoryKey] : null;
  };

  const handleProfileEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleMyPattern = () => {
    navigation.navigate('MyPattern');
  };

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // 현재 로그인된 사용자 ID 가져오기
        const userId = await getCurrentUserId();
        if (!userId) {
          throw new Error('사용자 ID를 찾을 수 없습니다.');
        }

        // 사용자 정보 조회
        const userInfo = await getUserById(userId);
        console.log('받은 사용자 정보:', userInfo);
        // API 응답 구조에 맞게 데이터 추출
        setProfileData((userInfo as any).data);
      } catch (err) {
        console.error('프로필 정보 로드 실패:', err);
        setError('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 로딩 상태 처리
  if (loading) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="text-body-medium-regular text-text-primary mt-4">
            프로필 정보를 불러오는 중...
          </Text>
        </View>
      </Layout>
    );
  }

  // 에러 상태 처리
  if (error || !profileData) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-body-large-regular text-text-primary text-center mb-4">
            {error || '프로필 정보를 불러올 수 없습니다.'}
          </Text>
          <TouchableOpacity
            className="bg-red-400 rounded-2xl px-6 py-3"
            onPress={async () => {
              const fetchUserProfile = async () => {
                try {
                  setLoading(true);
                  setError(null);

                  const userId = await getCurrentUserId();
                  if (!userId) {
                    throw new Error('사용자 ID를 찾을 수 없습니다.');
                  }

                  const userInfo = await getUserById(userId);
                  setProfileData((userInfo as any).data);
                } catch (err) {
                  console.error('프로필 정보 로드 실패:', err);
                  setError('프로필 정보를 불러오는데 실패했습니다.');
                } finally {
                  setLoading(false);
                }
              };

              fetchUserProfile();
            }}
          >
            <Text className="text-white text-body-medium-semibold">
              다시 시도
            </Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

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
                source={{
                  uri:
                    profileData.profileImageUrls?.[0] ||
                    'https://via.placeholder.com/150',
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* 이름, 나이, 성별과 소개글 */}
            <View className="flex-1">
              <Text className="text-subheading-bold text-gray-900 mb-2">
                {`${profileData.nickname || '사용자'} (${profileData.age || '?'})`}
              </Text>
              <Text className="text-body-large-regular text-text-primary">
                {profileData.introduction || '소개글이 없습니다.'}
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
          <View className="bg-mango-red/30 rounded-full px-6 py-4 flex-row items-center mb-4">
            <Text className="text-xl mr-2">
              {getCategoryInfo(profileData.mainType)?.emoji || '❓'}
            </Text>
            <Text className="text-body-large-semibold">
              당신은{' '}
              <Text className="font-bold">
                {profileData.mainType || '미분류'}
              </Text>{' '}
              유형입니다
            </Text>
          </View>

          {/* 설명 텍스트 */}
          <Text className="text-text-primary text-body-small-regular px-4 leading-5 mb-4">
            {getCategoryInfo(profileData.mainType)?.detailedDescription ||
              '소비패턴 설명이 없습니다.'}
          </Text>

          {/* 해시태그 */}
          <View className="flex-row flex-wrap mb-6 px-4">
            {(profileData.keywords || []).map(
              (keyword: string, index: number) => (
                <View
                  key={index}
                  className="bg-gray rounded-full px-4 py-2 mr-2 mb-2"
                >
                  <Text className="text-text-primary text-body-medium-semibold">
                    #{keyword.trim()}
                  </Text>
                </View>
              )
            )}
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
