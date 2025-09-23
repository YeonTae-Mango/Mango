import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ActionButtons from '../../components/home/ActionButtons';
import NoMoreCategoryProfilesModal from '../../components/category/NoMoreCategoryProfilesModal';
import ProfileCard, { ProfileCardRef } from '../../components/home/ProfileCard';
import Layout from '../../components/common/Layout';
import { useSwipe } from '../../hooks/useSwipe';
import { useAuthStore } from '../../store/authStore';
import { getCategoryById } from '../../constants/category';

interface CategorySwipeScreenProps {
  onLogout?: () => void;
}

export default function CategorySwipeScreen({
  onLogout,
}: CategorySwipeScreenProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryTitle } = route.params as { categoryTitle: string };
  const profileCardRef = useRef<ProfileCardRef>(null);

  // 현재 로그인된 사용자 정보
  const { user } = useAuthStore();
  const userId = user?.id || 0;

  // 카테고리 이름에서 이모지 제거 (예: "🔥 핫플형" -> "핫플형")
  const categoryName = categoryTitle.replace(/^[^\w\s]+/, '').trim();

  // 한국어 카테고리 이름을 영어 ID로 매핑
  const categoryMapping: Record<string, string> = {
    핫플형: 'hotplace',
    쇼핑형: 'shopping',
    예술가형: 'artist',
    뷰티형: 'beauty',
    여행가형: 'airport',
    자기계발형: 'study',
    스포츠형: 'sports',
    집돌이형: 'cozyroom',
  };

  const categoryId =
    categoryMapping[categoryName] || categoryName.toLowerCase();

  // 디버깅을 위한 로그
  console.log('CategorySwipeScreen Debug:', {
    categoryTitle,
    categoryName,
    categoryId,
    userId,
  });

  // 카테고리 정보 가져오기
  const categoryInfo = getCategoryById(categoryId as any);

  // useSwipe 훅 사용 - 카테고리 이름 전달
  const {
    currentProfile,
    isLoading,
    isError,
    hasMoreProfiles,
    likeProfile,
    dislikeProfile,
    likeProfileBySwipe,
    dislikeProfileBySwipe,
    completeSwipe,
    refreshProfiles,
    hasProfiles,
    profiles,
    error,
    totalProfiles,
    currentIndex,
  } = useSwipe(userId, {
    category: categoryName, // 이모지가 제거된 한국어 카테고리 이름 전달
    onSwipeSuccess: (direction: 'left' | 'right') => {
      profileCardRef.current?.triggerSwipe(direction);
    },
  });

  // useSwipe 훅 응답값 디버깅
  console.log('useSwipe 응답값:', {
    currentProfile,
    isLoading,
    isError,
    hasMoreProfiles,
    hasProfiles,
    profiles: profiles?.length || 0,
    totalProfiles,
    currentIndex,
    error: error?.message || null,
  });

  // 프로필 데이터 상세 로그
  if (profiles && profiles.length > 0) {
    console.log('프로필 목록 상세:', profiles);
    console.log('현재 프로필 상세:', currentProfile);
  } else if (!isLoading && !isError) {
    console.log('프로필이 없습니다. API 응답이 비어있을 수 있습니다.');
  }

  // 모든 프로필을 다 조회한 경우 NoMoreProfilesModal 자동 표시
  useEffect(() => {
    if (
      !isLoading &&
      hasProfiles &&
      !hasMoreProfiles &&
      currentProfile === null
    ) {
      setShowNoMoreProfilesModal(true);
    }
  }, [isLoading, hasProfiles, hasMoreProfiles, currentProfile]);

  // 프로필이 아예 없는 경우 모달 표시
  useEffect(() => {
    if (!isLoading && !isError && !hasProfiles && profiles.length === 0) {
      setShowNoMoreProfilesModal(true);
    }
  }, [isLoading, isError, hasProfiles, profiles.length]);

  // 스와이프 상태 관리
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null
  );
  const [swipeIntensity, setSwipeIntensity] = useState(0);

  // 모달 상태 관리
  const [showNoMoreProfilesModal, setShowNoMoreProfilesModal] = useState(false);

  const handleDislike = () => {
    if (currentProfile) {
      dislikeProfile(currentProfile.id);
    }
  };

  const handleMango = () => {
    if (currentProfile) {
      likeProfile(currentProfile.id);
    }
  };

  const handleSwipeUpdate = (
    direction: 'left' | 'right' | null,
    intensity: number
  ) => {
    setSwipeDirection(direction);
    setSwipeIntensity(intensity);
  };

  const handleNextProfile = (action: 'like' | 'dislike') => {
    if (currentProfile) {
      if (action === 'like') {
        likeProfileBySwipe(currentProfile.id);
      } else {
        dislikeProfileBySwipe(currentProfile.id);
      }
      completeSwipe();
    }
  };

  const handleCloseModal = () => {
    setShowNoMoreProfilesModal(false);
  };

  const handleGoBackToCategory = () => {
    setShowNoMoreProfilesModal(false);
    navigation.goBack(); // 카테고리 목록으로 돌아가기
  };

  // 인증 상태 처리
  if (!user) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">
            사용자 정보를 불러오는 중...
          </Text>
        </View>
      </Layout>
    );
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">
            {categoryName} 프로필을 불러오는 중...
          </Text>
        </View>
      </Layout>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-red-600 mb-4">
            프로필을 불러오는데 실패했습니다.
          </Text>
          <TouchableOpacity
            onPress={() => refreshProfiles()}
            className="bg-orange-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-medium">다시 시도</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <Layout onLogout={onLogout} showBottomSafeArea={false}>
      <View className="flex-1 bg-white relative">
        {/* 헤더 */}
        {/* <View className="px-4 py-3 bg-white border-b border-gray-100">
          <Text className="text-lg font-bold text-center">
            {categoryInfo?.emoji} {categoryName}
          </Text>
        </View> */}

        {/* 프로필 카드 */}
        {currentProfile && (
          <ProfileCard
            ref={profileCardRef}
            profile={currentProfile}
            onSwipeUpdate={handleSwipeUpdate}
            onNextProfile={handleNextProfile}
          />
        )}

        {/* 액션 버튼 */}
        <View className="absolute bottom-0 left-0 right-0 z-30">
          <ActionButtons
            onDislike={handleDislike}
            onMango={handleMango}
            swipeDirection={swipeDirection}
            swipeIntensity={swipeIntensity}
          />
        </View>

        {/* 모달 */}
        <NoMoreCategoryProfilesModal
          visible={showNoMoreProfilesModal}
          onClose={handleCloseModal}
          onGoBack={handleGoBackToCategory}
          categoryName={categoryName}
        />
      </View>
    </Layout>
  );
}
