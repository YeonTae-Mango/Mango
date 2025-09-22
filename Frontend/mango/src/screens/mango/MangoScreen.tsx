import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Layout from '../../components/common/Layout';
import MangoCard from '../../components/mango/MangoCard';
import MangoTab from '../../components/mango/MangoTab';
import { useMangoFollowers, useMangoFollowing } from '../../hooks/useMango';
import { useAuthStore } from '../../store/authStore';
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

    // 탭 변경 시 해당 탭의 최신 데이터 새로고침
    if (currentUserId) {
      if (tab === 'sent') {
        refetchFollowing();
      } else {
        refetchFollowers();
      }
    }
  };

  // 현재 로그인된 사용자 정보 (새로운 인증 시스템 사용)
  const { user } = useAuthStore();
  const currentUserId = user?.id || 0;

  // 내가 망고한 사람들 목록 조회 (sent 탭)
  const {
    data: mangoFollowingData,
    isLoading: isFollowingLoading,
    error: followingError,
    refetch: refetchFollowing,
  } = useMangoFollowing(currentPage, {
    enabled: activeTab === 'sent',
  });

  // 나를 망고한 사람들 목록 조회 (received 탭)
  const {
    data: mangoFollowersData,
    isLoading: isFollowersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useMangoFollowers(currentPage, {
    enabled: activeTab === 'received',
  });

  // 현재 활성 탭에 따른 데이터 및 상태 처리
  const currentData =
    activeTab === 'sent' ? mangoFollowingData : mangoFollowersData;
  const isLoading =
    activeTab === 'sent' ? isFollowingLoading : isFollowersLoading;
  const error = activeTab === 'sent' ? followingError : followersError;
  const refetch = activeTab === 'sent' ? refetchFollowing : refetchFollowers;

  // 탭에 따른 데이터 처리
  const users: MangoUser[] = (currentData as any)?.data || [];

  // 화면에 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (currentUserId) {
        // 현재 활성 탭에 따라 해당 데이터를 새로고침
        if (activeTab === 'sent') {
          refetchFollowing();
        } else {
          refetchFollowers();
        }
      }
    }, [currentUserId, activeTab, refetchFollowing, refetchFollowers])
  );

  return (
    <Layout onLogout={onLogout} showBottomSafeArea={false}>
      <View className="flex-1 bg-white">
        {/* 탭 컴포넌트 */}
        <MangoTab activeTab={activeTab} onTabChange={handleTabChange} />

        {/* 스크롤 가능한 카드 목록 */}
        {!currentUserId ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ff6b6b" />
            <Text className="mt-2 text-gray-600">
              사용자 정보를 불러오는 중...
            </Text>
          </View>
        ) : isLoading ? (
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
