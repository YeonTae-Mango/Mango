import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Layout from '../../components/common/Layout';
import ActionButtons from '../../components/home/ActionButtons';
import ProfileCard, { ProfileCardRef } from '../../components/home/ProfileCard';

interface HomeScreenProps {
  onLogout?: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  // ProfileCard ref 생성
  const profileCardRef = useRef<ProfileCardRef>(null);

  // 스와이프 상태 관리(방향 및 강도)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null // 방향
  );
  const [swipeIntensity, setSwipeIntensity] = useState(0); // 강도

  const profileData = {
    userId: 123,
    nickname: '닝닝',
    age: 26,
    primaryCategory: '핫플헌터',
    secondCategory1: '카페인중독',
    secondCategory2: '인터넷쇼핑',
    secondCategory3: '빵순이',
    introduction: '한줄소개입니다',
    imageUrls: {
      imageUrl1:
        'https://postfiles.pstatic.net/MjAyNTA5MDZfMzkg/MDAxNzU3MTY1MzgxOTgy.qGR7VaYRlN94ot1rrKgvvRYJ_vKcJdFYT0Ai1uZVA0Eg.IRYvwfJ2qcg4MuKJoqzlrsNBYCOTPP5pdlsMmv2rfrIg.JPEG/20250905%EF%BC%BF134146_%EF%BC%881%EF%BC%89.jpg?type=w966',
      imageUrl2:
        'https://postfiles.pstatic.net/MjAyNTA5MDZfMTE1/MDAxNzU3MTY1NDAyNjc3.D02T6VofqRJojShRS6lMpFw6QT4MmxzddylGh7vCay8g.geeFikDZC6m7HBBx8-uQPLcfGCMWnqBq365cBM-LKvAg.JPEG/900%EF%BC%BF20250905%EF%BC%BF134433.jpg?type=w966',
      imageUrl3:
        'https://postfiles.pstatic.net/MjAyNTA5MDZfNSAg/MDAxNzU3MTY1MzgzMTI0.fLd0OetY7hBC2Z8MZ-sQSGKiVfwbWWjUNnfdF26mNU8g.xex89sDuzUNvuNnx2C6VuMDpASZ7o_4wHOVqSiycsg8g.JPEG/900%EF%BC%BF20250905%EF%BC%BF135623.jpg?type=w966',
      imageUrl4:
        'https://postfiles.pstatic.net/MjAyNTA5MDZfMjg4/MDAxNzU3MTY1NDE0MTE3.2qXmMqK7suL5TS79-hyreiKwcQ9Yf7TDihqrD_xaV5sg.MXQ0kmqPHY7IDSZQXvDl6ZU-4xHoOBA5jyMHLcdpeBUg.JPEG/900%EF%BC%BF20250905%EF%BC%BF134131.jpg?type=w966',
    },
    likeme: true,
    sigungu: '관악구',
    distance: '2km',
    likes: false,
  };

  const handleReject = () => {
    console.log('Profile rejected');
    // ProfileCard의 왼쪽 스와이프 애니메이션 트리거
    profileCardRef.current?.triggerSwipe('left');
  };

  const handleMango = () => {
    console.log('Profile mango');
    // ProfileCard의 오른쪽 스와이프 애니메이션 트리거
    profileCardRef.current?.triggerSwipe('right');
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

  // 다음 프로필 조회 핸들러
  const handleNextProfile = (action: 'like' | 'reject') => {
    console.log(`다음 프로필 로드: ${action}`);
    // TODO: 실제 다음 프로필 데이터를 API에서 가져오는 로직 구현
    // TODO: 현재 액션(좋아요/거절)을 서버에 전송하는 로직 구현
  };

  return (
    <Layout onLogout={onLogout} showBottomSafeArea={false}>
      <View className="flex-1 bg-white relative">
        {/* 프로필 카드 - 스와이프 제스처 감지 및 애니메이션을 처리 */}
        <ProfileCard
          ref={profileCardRef}
          profile={profileData}
          onSwipeUpdate={handleSwipeUpdate}
          onNextProfile={handleNextProfile}
        />

        {/* 액션 버튼 - 스와이프 상태에 따라 크기와 색상이 변동 */}
        <View className="absolute bottom-0 left-0 right-0 z-30">
          <ActionButtons
            onReject={handleReject}
            onMango={handleMango}
            swipeDirection={swipeDirection}
            swipeIntensity={swipeIntensity}
          />
        </View>
      </View>
    </Layout>
  );
}
