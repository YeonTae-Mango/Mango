import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import Layout from '../../components/common/Layout';
import MangoCard from '../../components/mango/MangoCard';
import MangoTab from '../../components/mango/MangoTab';
import {
  useInfiniteMangoFollowers,
  useInfiniteMangoFollowing,
} from '../../hooks/useMango';
import { useAuthStore } from '../../store/authStore';
import type { MangoUser } from '../../types/mango';

interface MangoScreenProps {
  onLogout: () => void;
}

export default function MangoScreen({ onLogout }: MangoScreenProps) {
  // 탭 상태에 따른 API 호출
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  // 망고 카드 클릭 핸들러
  const navigation = useNavigation<any>();
  const handleProfilePress = useCallback(
    (userName: string, userId?: number) => {
      navigation.navigate('ProfileDetail', {
        userName,
        userId,
        fromScreen: 'Mango',
        activeTab, // 현재 활성 탭 정보 추가
      });
    },
    [navigation, activeTab]
  );
  // 탭 변경 핸들러
  const handleTabChange = (tab: 'received' | 'sent') => {
    setActiveTab(tab);

    // 탭 변경 시 해당 탭의 최신 데이터 새로고침
    if (currentUserId) {
      if (tab === 'sent') {
        refetchFollowing();
      } else {
        refetchFollowers();
      }
    }
  };

  // 현재 로그인된 사용자 정보
  const { user } = useAuthStore();
  const currentUserId = user?.id || 0;

  // 내가 망고한 사람들 무한 스크롤 목록 조회 (sent 탭)
  const {
    data: followingData,
    fetchNextPage: fetchNextFollowing,
    hasNextPage: hasNextFollowing,
    isFetchingNextPage: isFetchingNextFollowing,
    isLoading: isFollowingLoading,
    error: followingError,
    refetch: refetchFollowing,
  } = useInfiniteMangoFollowing();

  // 나를 망고한 사람들 무한 스크롤 목록 조회 (received 탭)
  const {
    data: followersData,
    fetchNextPage: fetchNextFollowers,
    hasNextPage: hasNextFollowers,
    isFetchingNextPage: isFetchingNextFollowers,
    isLoading: isFollowersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useInfiniteMangoFollowers();

  // 현재 활성 탭에 따른 데이터 및 상태 처리
  const isLoading =
    activeTab === 'sent' ? isFollowingLoading : isFollowersLoading;
  const error = activeTab === 'sent' ? followingError : followersError;
  const refetch = activeTab === 'sent' ? refetchFollowing : refetchFollowers;
  const fetchNextPage =
    activeTab === 'sent' ? fetchNextFollowing : fetchNextFollowers;
  const hasNextPage =
    activeTab === 'sent' ? hasNextFollowing : hasNextFollowers;
  const isFetchingNextPage =
    activeTab === 'sent' ? isFetchingNextFollowing : isFetchingNextFollowers;

  // 무한 스크롤 데이터를 평탄화하여 단일 배열로 변환
  const users: MangoUser[] = useMemo(() => {
    const data = activeTab === 'sent' ? followingData : followersData;

    if (!data?.pages) return [];
    // API 응답 구조에 따라 data 필드 추출
    const allUsers = data.pages.flatMap(page => {
      return (page as any)?.data || [];
    });

    return allUsers;
  }, [activeTab, followingData, followersData]);

  // 무한 스크롤 로드 더 함수
  const handleLoadMore = useCallback(() => {
    // 다음 페이지가 있고, 현재 다음 페이지를 불러오고 있지 않을 때만 호출
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // MangoCard 렌더링 함수
  const renderMangoCard = useCallback(
    ({ item }: { item: MangoUser }) => (
      <MangoCard key={item.userId} user={item} onPress={handleProfilePress} />
    ),
    [handleProfilePress]
  );

  // Footer 렌더링 (로딩 인디케이터)
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#ff6b6b" />
      </View>
    );
  }, [isFetchingNextPage]);

  // 빈 리스트 컴포넌트
  const renderEmptyComponent = useCallback(
    () => (
      <View className="w-full flex-1 justify-center items-center py-20">
        <Text className="text-gray-500 text-center">
          {activeTab === 'sent'
            ? '아직 망고한 사람이 없습니다.'
            : '나를 망고한 사람이 없습니다.'}
        </Text>
      </View>
    ),
    [activeTab]
  );

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
          <FlatList
            data={users}
            renderItem={renderMangoCard}
            keyExtractor={item => item.userId.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyComponent}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}
      </View>
    </Layout>
  );
}
