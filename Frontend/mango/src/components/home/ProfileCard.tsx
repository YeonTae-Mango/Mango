import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface UserProfile {
  userId: number;
  nickname: string;
  age: number;
  primaryCategory: string;
  secondCategory1: string;
  secondCategory2: string;
  secondCategory3: string;
  introduction: string;
  imageUrls: {
    imageUrl1: string;
    imageUrl2: string;
    imageUrl3: string;
    imageUrl4: string;
  };
  likeme: boolean;
  sigungu: string;
  distance: string;
  likes: boolean;
}

interface ProfileCardProps {
  profile: UserProfile;
  onSwipeUpdate: (
    direction: 'left' | 'right' | null,
    intensity: number
  ) => void;
  onNextProfile?: (action: 'like' | 'reject') => void;
}

export interface ProfileCardRef {
  triggerSwipe: (direction: 'left' | 'right') => void;
}

const ProfileCard = forwardRef<ProfileCardRef, ProfileCardProps>(
  ({ profile, onSwipeUpdate, onNextProfile }, ref) => {
    const {
      nickname,
      age,
      primaryCategory,
      secondCategory1,
      secondCategory2,
      secondCategory3,
      imageUrls,
      distance,
      likeme,
    } = profile;

    const images = [
      imageUrls.imageUrl1,
      imageUrls.imageUrl2,
      imageUrls.imageUrl3,
      imageUrls.imageUrl4,
    ];
    const tags = [secondCategory1, secondCategory2, secondCategory3];

    // 이미지 슬라이더 상태 및 핸들러
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxImages = Math.min(images.length, 4);

    const handlePrev = () => {
      setCurrentIndex(prev => (prev === 0 ? maxImages - 1 : prev - 1));
    };
    const handleNext = () => {
      setCurrentIndex(prev => (prev === maxImages - 1 ? 0 : prev + 1));
    };

    // 스와이프 애니메이션을 위한 Shared Values
    // react-native-reanimated의 useSharedValue를 사용하여 UI 스레드에서 직접 애니메이션을 처리
    const translateX = useSharedValue(0); // 카드의 수평 이동 거리 (좌우 스와이프)
    const scale = useSharedValue(1); // 카드의 크기 변화 (스와이프 강도에 따라 약간 커짐)

    // PAN 제스처 핸들러 (스와이프 제스처 처리)
    // react-native-gesture-handler의 PanGestureHandler를 사용하여 드래그 제스처를 감지
    const gestureHandler =
      useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        // 제스처 시작 시점
        onStart: () => {},

        // 제스처 진행 중 (실시간 호출)
        onActive: event => {
          // 카드 이동: 사용자의 드래그 거리만큼 카드를 수평으로 이동
          translateX.value = event.translationX;

          // 카드 크기 변화: 더 부드럽게 변화
          scale.value = 1 + Math.abs(event.translationX) * 0.0003;

          // 스와이프 방향과 강도 계산
          const swipeThreshold = 30; // 더 민감하게 반응
          let direction: 'left' | 'right' | null = null;
          let intensity = 0; // 0~1 사이의 강도값

          // 임계점을 넘었을 때만 스와이프로 인정
          if (Math.abs(event.translationX) > swipeThreshold) {
            // 방향 결정: 양수(+)면 오른쪽, 음수(-)면 왼쪽
            direction = event.translationX > 0 ? 'right' : 'left';

            // 강도 계산: 150픽셀 드래그 시 강도 1.0 (더 빠르게 반응)
            intensity = Math.min(Math.abs(event.translationX) / 150, 1);
          }

          // 부모 컴포넌트(HomeScreen)로 스와이프 정보 전달
          runOnJS(onSwipeUpdate)(direction, intensity);
        },

        // 제스처 종료 시점
        onEnd: event => {
          // 임계점 검사 (다음 프로필로 넘어갈지 결정)
          const threshold = 250; // 임계 드래그 거리

          if (Math.abs(event.translationX) > threshold) {
            // 임계점 넘음: 카드를 화면 밖으로 애니메이션하고 다음 프로필 로드
            const direction = event.translationX > 0 ? 'right' : 'left';
            const exitX = event.translationX > 0 ? 1000 : -1000; // 화면 밖으로 이동할 거리

            // 카드를 화면 밖으로 부드럽게 이동
            translateX.value = withTiming(exitX, {
              duration: 300, // 0.3초 동안
              easing: Easing.out(Easing.quad), // 부드러운 감속 곡선
            });

            // 다음 프로필 로드 (0.15초 후)
            setTimeout(() => {
              if (onNextProfile) {
                runOnJS(onNextProfile)(
                  direction === 'right' ? 'like' : 'reject'
                );
              }
            }, 150);

            // 스와이프 상태 초기화
            runOnJS(onSwipeUpdate)(null, 0);
          } else {
            // 임계점 미달: 원래 위치로 부드럽게 복원
            translateX.value = withSpring(0, {
              damping: 20, // 더 부드러운 스프링
              stiffness: 150, // 적당한 탄성
            });
            scale.value = withSpring(1, {
              damping: 20,
              stiffness: 150,
            });
            // 스와이프 상태 초기화
            runOnJS(onSwipeUpdate)(null, 0);
          }
        },
      });

    // 버튼 클릭 시 스와이프 애니메이션 실행 함수
    const triggerButtonSwipe = (direction: 'left' | 'right') => {
      const exitX = direction === 'right' ? 1000 : -1000; // 화면 밖으로 이동할 거리

      // 카드를 화면 밖으로 부드럽게 이동
      translateX.value = withTiming(exitX, {
        duration: 300, // 0.3초 동안
        easing: Easing.out(Easing.quad), // 부드러운 감속 곡선
      });

      // 다음 프로필 로드 (0.15초 후)
      setTimeout(() => {
        if (onNextProfile) {
          onNextProfile(direction === 'right' ? 'like' : 'reject');
        }
      }, 150);

      // 스와이프 상태 초기화
      onSwipeUpdate(null, 0);
    };

    // ref를 통해 외부에서 호출 가능한 함수들을 노출
    useImperativeHandle(ref, () => ({
      triggerSwipe: triggerButtonSwipe,
    }));

    // 카드 애니메이션 스타일 계산
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value }, // 수평 이동: 드래그 거리만큼 좌우로 이동
          { scale: scale.value }, // 크기 변화: 드래그 강도에 따라 살짝 커짐
          { rotate: `${translateX.value * 0.08}deg` }, // 회전 효과: 더 부드럽게 기울어짐 (틴더 스타일)
        ],
      };
    });

    return (
      // PAN 제스처 핸들러로 전체 카드를 감싸서 드래그 제스처를 감지
      <PanGestureHandler onGestureEvent={gestureHandler}>
        {/* 애니메이션이 적용되는 카드 컨테이너 */}
        <Animated.View style={animatedStyle} className="flex-1 bg-white mb-8">
          {/* 프로필 영역 */}
          <View className="flex-1 flex-row items-center justify-center relative">
            {/* 그라디언트 오버레이 영역 */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              locations={[0, 0.5, 1]}
              className="absolute bottom-0 left-0 right-0 h-full z-10"
            />
            {/* 프로그레스 바 오버레이 영역 */}
            <View className="absolute top-4 left-0 right-0 flex-row justify-center z-20">
              {Array.from({ length: maxImages }).map((_, idx) => (
                <View
                  key={idx}
                  className={`h-1 rounded mx-1 ${currentIndex === idx ? 'w-10 bg-white' : 'w-8 bg-white/30'}`}
                />
              ))}
            </View>

            {/* 이미지 슬라이더 영역 */}
            <TouchableOpacity
              className="absolute left-0 w-[50%] h-full z-20"
              onPress={handlePrev}
            />
            <Image
              source={{ uri: images[currentIndex] }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute right-0 w-[50%] h-full z-20"
              onPress={handleNext}
            />

            {/* 프로필 정보 오버레이 영역 */}
            <View className="absolute bottom-20 left-0 right-0 px-5 z-20">
              <View className="flex-row items-center mb-3 ml-1">
                {/* 거리 */}
                <View className="bg-mango-primary rounded-full px-4 py-1.5 flex-row items-center self-start mr-2">
                  <Ionicons name="location-outline" size={14} color="white" />
                  <Text className="text-body-small-semibold text-white ml-2">
                    {distance}
                  </Text>
                </View>
                {/* 망고 여부 - likeme가 true일 때만 표시 */}
                {likeme && (
                  <View className="bg-mango-primary/20 border-mango-primary rounded-full px-4 py-1.5  self-start">
                    <Text className="text-body-small-semibold text-white">
                      나를 망고한 사람
                    </Text>
                  </View>
                )}
              </View>
              {/* 이름 나이 & 유형 */}
              <View className="flex-row items-center mb-3 ml-1">
                <Text className="text-heading-bold text-white mr-4">
                  {nickname} <Text>{age}</Text>
                </Text>
                <View className="bg-mango-red rounded-full px-4 py-1 flex-row items-center">
                  <Ionicons name="flame-outline" size={18} color="white" />
                  <Text className="text-body-large-regular text-white ml-2">
                    {primaryCategory}
                  </Text>
                </View>
              </View>
              {/* 해시태그 */}
              <View className="flex-row flex-wrap">
                {tags.map((tag, idx) => (
                  <Text
                    key={idx}
                    className="bg-white/20 rounded-full px-4 py-1.5 mr-2 text-small-semibold text-white"
                  >
                    # {tag}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
