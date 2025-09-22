import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Layout from '../../components/common/Layout';
import MangoCard from '../../components/mango/MangoCard';
import MangoTab from '../../components/mango/MangoTab';
import { useMangoFollowers, useMangoFollowing } from '../../hooks/useMango';
import type { MangoUser } from '../../types/mango';

interface MangoScreenProps {
  onLogout: () => void;
}

export default function MangoScreen({ onLogout }: MangoScreenProps) {
  // 망고 카드 클릭 핸들러
  const navigation = useNavigation<any>();
  const handleProfilePress = (userName: string) => {
    navigation.navigate('ProfileDetail', { userName, fromScreen: 'Mango' });
  };

  // 탭 상태에 따른 API 호출
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  // 페이지 상태 관리
  const [currentPage, setCurrentPage] = useState(0);
  // 탭 변경 핸들러
  const handleTabChange = (tab: 'received' | 'sent') => {
    setActiveTab(tab);
    setCurrentPage(0); // 탭 변경 시 페이지 초기화
  };

  // 테스트용 사용자 ID 및 토큰
  const currentUserId = 107;
  const testToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDciLCJpYXQiOjE3NTg1MDAyNzYsImV4cCI6MTc1ODU4NjY3Nn0.C-CmqoRu60abusYZxQMH5BoTINnYSa7orrjDzjnVK5Q';

  // TODO: 로그인 기능 구현 후 아래 코드로 교체
  // const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // useEffect(() => {
  //   const loadUserId = async () => {
  //     try {
  //       const userId = await getCurrentUserId();
  //       setCurrentUserId(userId);
  //       console.log('로그인된 사용자 ID:', userId);
  //     } catch (error) {
  //       console.error('사용자 ID 로딩 실패:', error);
  //       // 로그인 페이지로 리다이렉트 또는 에러 처리
  //     }
  //   };

  //   loadUserId();
  // }, []);

  // 컴포넌트 마운트 시 테스트 자격증명 설정
  useEffect(() => {
    const setTestCredentials = async () => {
      try {
        await AsyncStorage.setItem('authToken', testToken);
        await AsyncStorage.setItem('userId', currentUserId.toString());
        console.log('테스트 자격증명 설정 완료');
      } catch (error) {
        console.error('테스트 자격증명 설정 실패:', error);
      }
    };

    setTestCredentials();
  }, []);

  // 내가 망고한 사람들 목록 조회 (sent 탭)
  const {
    data: mangoFollowingData,
    isLoading: isFollowingLoading,
    error: followingError,
    refetch: refetchFollowing,
  } = useMangoFollowing(currentUserId, currentPage, {
    enabled: activeTab === 'sent',
  });

  // TODO: 로그인 기능 구현 후 아래 코드로 교체
  // } = useMangoFollowing(currentUserId, currentPage, {
  //   enabled: activeTab === 'sent' && !!currentUserId,
  // });

  // 나를 망고한 사람들 목록 조회 (received 탭)
  const {
    data: mangoFollowersData,
    isLoading: isFollowersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useMangoFollowers(currentUserId, currentPage, {
    enabled: activeTab === 'received',
  });

  // TODO: 로그인 기능 구현 후 아래 코드로 교체
  // } = useMangoFollowers(currentUserId, currentPage, {
  //   enabled: activeTab === 'received' && !!currentUserId,
  // });

  // 현재 활성 탭에 따른 데이터 및 상태 처리
  const currentData =
    activeTab === 'sent' ? mangoFollowingData : mangoFollowersData;
  const isLoading =
    activeTab === 'sent' ? isFollowingLoading : isFollowersLoading;
  const error = activeTab === 'sent' ? followingError : followersError;
  const refetch = activeTab === 'sent' ? refetchFollowing : refetchFollowers;

  // 탭에 따른 데이터 처리
  const users: MangoUser[] = (currentData as any)?.data || [];

  return (
    <Layout onLogout={onLogout} showBottomSafeArea={false}>
      <View className="flex-1 bg-white">
        {/* 탭 컴포넌트 */}
        <MangoTab activeTab={activeTab} onTabChange={handleTabChange} />

        {/* 스크롤 가능한 카드 목록 */}
        {/* TODO: 로그인 기능 구현 후 아래 코드 주석 해제 */}
        {/* !currentUserId ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ff6b6b" />
            <Text className="mt-2 text-gray-600">사용자 정보를 불러오는 중...</Text>
          </View>
        ) : */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ff6b6b" />
            <Text className="mt-2 text-gray-600">
              {activeTab === 'sent'
                ? '내가 망고한 사람 목록을 불러오는 중...'
                : '나를 망고한 사람 목록을 불러오는 중...'}
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 text-center mb-4">
              {activeTab === 'sent'
                ? '내가 망고한 사람 목록을 불러오는데 실패했습니다.'
                : '나를 망고한 사람 목록을 불러오는데 실패했습니다.'}
            </Text>
            <Text className="text-red-400 text-center mb-2 text-xs">
              오류 코드: {(error as any)?.response?.status || 'Unknown'}
            </Text>
            <Text className="text-red-400 text-center mb-4 text-xs">
              {(error as any)?.response?.data?.message ||
                (error as any)?.message ||
                '알 수 없는 오류'}
            </Text>
            <Text className="text-blue-500 underline" onPress={() => refetch()}>
              다시 시도
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
          >
            <View className="flex-row flex-wrap justify-between">
              {users.length > 0 ? (
                users.map((user: MangoUser) => (
                  <MangoCard
                    key={user.userId}
                    user={user}
                    onPress={handleProfilePress}
                  />
                ))
              ) : (
                <View className="w-full flex-1 justify-center items-center py-20">
                  <Text className="text-gray-500 text-center">
                    {activeTab === 'sent'
                      ? '아직 망고한 사람이 없습니다.'
                      : '나를 망고한 사람이 없습니다.'}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </Layout>
  );
}
