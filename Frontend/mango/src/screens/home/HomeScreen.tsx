import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// import { getCurrentUserId } from '../../api/auth'; // 실제 로그인 구현 시 사용
import { setTestCredentials } from '../../api/auth'; // 테스트용
import Layout from '../../components/common/Layout';
import ActionButtons from '../../components/home/ActionButtons';
import NoMoreProfilesModal from '../../components/home/NoMoreProfilesModal';
import ProfileCard, { ProfileCardRef } from '../../components/home/ProfileCard';
import { useSwipe } from '../../hooks/useSwipe';

interface HomeScreenProps {
  onLogout?: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  const profileCardRef = useRef<ProfileCardRef>(null); // ProfileCard 참조
  const [userId, setUserId] = useState<number | null>(null); // 현재 로그인된 사용자 ID

  // useSwipe 훅 사용
  const {
    profiles,
    currentProfile,
    isLoading,
    isError,
    error,
    hasMoreProfiles,
    likeProfile,
    dislikeProfile,
    likeProfileBySwipe,
    dislikeProfileBySwipe,
    completeSwipe,
    refreshProfiles,
    hasProfiles,
  } = useSwipe(userId || 0, {
    onSwipeSuccess: (direction: 'left' | 'right') => {
      // API 성공 시 애니메이션 트리거 (버튼 클릭용)
      profileCardRef.current?.triggerSwipe(direction);
    },
  }); // userId가 null이면 0으로 대체

  // ===== 테스트용 자격증명 설정 =====
  useEffect(() => {
    const setTestAuth = async () => {
      try {
        // 테스트용 토큰과 사용자 ID 설정
        const testToken =
          'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDkiLCJpYXQiOjE3NTg1MTUzNDksImV4cCI6MTc1ODYwMTc0OX0.bFGTsYG1KE4LI4rOU4MWt5MN2gErk5V0rR-sSSCKp2Y';
        const testUserId = 109;

        await setTestCredentials(testToken, testUserId);
        setUserId(testUserId);
        console.log('테스트 자격증명 설정 완료');
      } catch (error) {
        console.error('테스트 자격증명 설정 실패:', error);
      }
    };
    setTestAuth();
  }, []);

  // ===== 실제 로그인 구현 시 사용할 코드 (현재 주석 처리) =====
  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       const id = await getCurrentUserId();
  //       setUserId(id);
  //     } catch (error) {
  //       console.error('사용자 ID 가져오기 실패:', error);
  //     }
  //   };
  //   fetchUserId();
  // }, []);

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

  // 스와이프 상태 관리(방향 및 강도)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null // 방향
  );
  const [swipeIntensity, setSwipeIntensity] = useState(0); // 강도

  // 모달 상태 관리
  const [showNoMoreProfilesModal, setShowNoMoreProfilesModal] = useState(false);

  const handleDislike = () => {
    if (currentProfile) {
      // 버튼 클릭: API 먼저 호출
      dislikeProfile(currentProfile.id);
      // API 성공 후 애니메이션은 useSwipe 훅에서 처리
    } else {
      console.log('현재 프로필이 없음');
    }
  };

  const handleMango = () => {
    if (currentProfile) {
      // 버튼 클릭: API 먼저 호출
      likeProfile(currentProfile.id);
      // API 성공 후 애니메이션은 useSwipe 훅에서 처리
    } else {
      console.log('현재 프로필이 없음');
    }
  };

  // 스와이프 핸들러
  // ProfileCard에서 발생하는 스와이프 이벤트를 받아서 상태를 업데이트
  // 실시간으로 호출되어 ActionButtons의 변화를 트리거
  const handleSwipeUpdate = (
    direction: 'left' | 'right' | null,
    intensity: number
  ) => {
    setSwipeDirection(direction); // 현재 스와이프 방향 업데이트
    setSwipeIntensity(intensity); // 현재 스와이프 강도 업데이트
  };

  // 다음 프로필 조회 핸들러 (스와이프 완료 시 호출)
  const handleNextProfile = (action: 'like' | 'dislike') => {
    console.log(`handleNextProfile 호출 - action: ${action}`);
    if (currentProfile) {
      console.log(
        `다음 프로필 로드: ${action}, profileId: ${currentProfile.id}`
      );

      // 스와이프 전용 함수 사용 (인덱스 증가 없이 API만 호출)
      if (action === 'like') {
        likeProfileBySwipe(currentProfile.id);
      } else {
        dislikeProfileBySwipe(currentProfile.id);
      }

      // 스와이프 완료 후 수동으로 인덱스 증가
      completeSwipe();
    } else {
      console.log('현재 프로필이 없음 (handleNextProfile)');
    }
  };

  // 모달 핸들러
  const handleCloseModal = () => {
    setShowNoMoreProfilesModal(false);
  };

  const handleConfirmDistance = (distance: number) => {
    console.log(`거리 조정: ${distance}km`);
    // 거리 설정 후 새로운 프로필 가져오기
    refreshProfiles();
    setShowNoMoreProfilesModal(false);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">프로필을 불러오는 중...</Text>
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
        {/* 프로필 카드 - 스와이프 제스처 감지 및 애니메이션을 처리 */}
        {currentProfile && (
          <ProfileCard
            ref={profileCardRef}
            profile={currentProfile}
            onSwipeUpdate={handleSwipeUpdate}
            onNextProfile={handleNextProfile}
          />
        )}

        {/* 액션 버튼 - 스와이프 상태에 따라 크기와 색상이 변동 */}
        <View className="absolute bottom-0 left-0 right-0 z-30">
          <ActionButtons
            onDislike={handleDislike}
            onMango={handleMango}
            swipeDirection={swipeDirection}
            swipeIntensity={swipeIntensity}
          />
        </View>

        {/* 모달들 */}
        <NoMoreProfilesModal
          visible={showNoMoreProfilesModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDistance}
        />
      </View>
    </Layout>
  );
}
