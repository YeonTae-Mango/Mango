import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { createOrGetChatRoom } from '../../api/chat';
import Layout from '../../components/common/Layout';
import ActionButtons from '../../components/home/ActionButtons';
import NoMoreProfilesModal from '../../components/home/NoMoreProfilesModal';
import ProfileCard, { ProfileCardRef } from '../../components/home/ProfileCard';
import { useSwipe } from '../../hooks/useSwipe';
import { useAuthStore } from '../../store/authStore';

interface HomeScreenProps {
  onLogout?: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  const profileCardRef = useRef<ProfileCardRef>(null); // ProfileCard 참조
  const navigation = useNavigation<any>();

  // 현재 로그인된 사용자 정보 (새로운 인증 시스템 사용)
  const { user } = useAuthStore();
  const userId = user?.id || 0;

  // 채팅방 생성 뮤테이션
  const createChatRoomMutation = useMutation({
    mutationFn: createOrGetChatRoom,
    onSuccess: chatRoomData => {
      console.log('🎉 채팅방 생성 성공:', chatRoomData);

      // 매치 성공 알림 후 채팅방으로 이동
      Alert.alert(
        '🎉 매치 성공!',
        `${(chatRoomData as any).otherUser?.nickname || '상대방'}님과 매치되었습니다! 채팅을 시작해보세요.`,
        [
          {
            text: '나중에',
            style: 'cancel',
          },
          {
            text: '채팅하기',
            onPress: () => {
              const roomData = chatRoomData as any;
              console.log('🚀 HomeScreen에서 채팅방으로 이동:', {
                chatRoomId: roomData.id.toString(),
                userName: roomData.otherUserNickname,
                userId: roomData.otherUserId,
                profileImageUrl: roomData.otherUserProfileImage,
              });
              navigation.navigate('ChatRoom', {
                chatRoomId: roomData.id.toString(),
                userName: roomData.otherUserNickname || '상대방',
                userId: roomData.otherUserId,
                profileImageUrl: roomData.otherUserProfileImage,
              });
            },
          },
        ]
      );
    },
    onError: error => {
      console.error('❌ 채팅방 생성 실패:', error);
      Alert.alert('오류', '채팅방 생성에 실패했습니다.');
    },
  });

  // useSwipe 훅 사용
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
  } = useSwipe(userId, {
    onSwipeSuccess: (direction: 'left' | 'right') => {
      // API 성공 시 애니메이션 트리거 (버튼 클릭용)
      profileCardRef.current?.triggerSwipe(direction);
    },
    onMatchSuccess: matchedProfile => {
      // 매치 성공 시 채팅방 생성
      console.log('🎉 매치 성공 콜백 호출:', matchedProfile);
      createChatRoomMutation.mutate(matchedProfile.id);
    },
  });

  // 모든 프로필을 다 조회한 경우 또는 처음부터 빈 목록인 경우 NoMoreProfilesModal 자동 표시
  useEffect(() => {
    if (!isLoading && !isError) {
      // 1. 처음부터 프로필이 없는 경우 (hasProfiles가 false)
      // 2. 모든 프로필을 다 스와이프한 경우 (hasProfiles가 true이지만 hasMoreProfiles가 false이고 currentProfile이 null)
      const shouldShowModal =
        !hasProfiles || // 처음부터 빈 목록
        (hasProfiles && !hasMoreProfiles && currentProfile === null); // 모든 프로필 소진

      if (shouldShowModal) {
        console.log('🚫 프로필 없음 - NoMoreProfilesModal 표시', {
          hasProfiles,
          hasMoreProfiles,
          currentProfile: !!currentProfile,
        });
        setShowNoMoreProfilesModal(true);
      }
    }
  }, [isLoading, isError, hasProfiles, hasMoreProfiles, currentProfile]);

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
    console.log('🍭 handleMango 호출됨:', {
      currentProfile,
      likeProfile: !!likeProfile,
    });
    if (currentProfile) {
      console.log('🍭 likeProfile 호출 시작:', currentProfile.id);
      // 버튼 클릭: API 먼저 호출
      likeProfile(currentProfile.id);
      console.log('🍭 likeProfile 호출 완료');
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
        {currentProfile ? (
          <ProfileCard
            ref={profileCardRef}
            profile={currentProfile}
            onSwipeUpdate={handleSwipeUpdate}
            onNextProfile={handleNextProfile}
          />
        ) : (
          // 프로필이 없는 경우 빈 화면 표시
          <View className="flex-1 justify-center items-center">
            <Text className="text-subheading-bold text-gray-400 mb-4">
              당신에 주변에 더이상 사람이 없어요😢
            </Text>
            <Text className="text-body-small-regular text-gray-400">
              검색 범위를 조정해보세요
            </Text>
          </View>
        )}

        {/* 액션 버튼 - 스와이프 상태에 따라 크기와 색상이 변동 */}
        {currentProfile && (
          <View className="absolute bottom-0 left-0 right-0 z-30">
            <ActionButtons
              onDislike={handleDislike}
              onMango={handleMango}
              swipeDirection={swipeDirection}
              swipeIntensity={swipeIntensity}
            />
          </View>
        )}

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
