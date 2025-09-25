import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CATEGORIES, CategoryType } from '../../constants/category';
import type { SwipeProfile } from '../../types/swipe';

interface ProfileCardProps {
  profile: SwipeProfile;
  onSwipeUpdate: (
    direction: 'left' | 'right' | null,
    intensity: number
  ) => void;
  onNextProfile?: (action: 'like' | 'dislike') => void;
}

export interface ProfileCardRef {
  triggerSwipe: (direction: 'left' | 'right') => void;
}

const ProfileCard = forwardRef<ProfileCardRef, ProfileCardProps>(
  ({ profile, onSwipeUpdate, onNextProfile }, ref) => {
    const {
      nickname,
      age,
      mainType,
      keywords,
      profileImageUrls,
      distance,
      theyLiked,
    } = profile;

    // 메인 타입으로 카테고리 정보 찾기
    const getCategoryInfo = (mainType: string) => {
      const categoryKey = Object.keys(CATEGORIES).find(
        key => CATEGORIES[key as CategoryType].name === mainType
      ) as CategoryType;

      return categoryKey ? CATEGORIES[categoryKey] : null;
    };

    // 이미지 슬라이더 상태 및 핸들러
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxImages = Math.min(profileImageUrls.length, 4);

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

    // 새로운 프로필이 로드될 때 애니메이션 값 리셋
    React.useEffect(() => {
      translateX.value = 0;
      scale.value = 1;
      setCurrentIndex(0); // 이미지 인덱스도 리셋
    }, [profile.id, translateX, scale]); // profile.id가 변경될 때마다 리셋

    // PanResponder를 사용한 제스처 처리
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 터치 시작 즉시 감지
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 수평 움직임이 수직 움직임보다 클 때만 스와이프로 인식
        const absDx = Math.abs(gestureState.dx);
        const absDy = Math.abs(gestureState.dy);

        // 매우 작은 움직임도 감지하되, 수평 움직임 우선
        return absDx > 0.5 || (absDx > 0.1 && absDx > absDy * 0.3);
      },
      onPanResponderGrant: (evt, gestureState) => {
        // 터치 시작 즉시 미세한 피드백 제공
        scale.value = withSpring(1.01, {
          damping: 25,
          stiffness: 400,
          mass: 0.5,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // 수평 이동만 적용 (세로 스크롤과 구분)
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // 수평 움직임이 더 클 때만 스와이프 적용
        if (absDx > absDy * 0.5) {
          translateX.value = dx;
          // 더 부드럽고 자연스러운 스케일 변화
          scale.value = 1 + absDx * 0.0002;

          // 낮은 임계값으로 즉시 반응
          const swipeThreshold = 3; // 5 → 3으로 더 낮춤
          let direction: 'left' | 'right' | null = null;
          let intensity = 0;

          if (absDx > swipeThreshold) {
            direction = dx > 0 ? 'right' : 'left';
            // 더 부드러운 강도 계산
            intensity = Math.min(absDx / 70, 1); // 80 → 70으로 더 민감하게
          }

          onSwipeUpdate(direction, intensity);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const dx = gestureState.dx;
        const absDx = Math.abs(dx);
        const velocity = Math.abs(gestureState.vx); // 속도도 고려

        // 거리 또는 속도 기준으로 스와이프 완료 판단
        const distanceThreshold = 35; // 40 → 35로 더 낮춤
        const velocityThreshold = 0.3; // 빠른 플릭 동작도 인식

        const shouldComplete =
          absDx > distanceThreshold || velocity > velocityThreshold;

        if (shouldComplete) {
          // 스와이프 완료
          const direction = dx > 0 ? 'right' : 'left';
          const exitX = dx > 0 ? 1200 : -1200;

          translateX.value = withTiming(exitX, {
            duration: Math.max(200, 400 - velocity * 200), // 속도에 따른 동적 시간
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          });

          // 살짝 확대되면서 사라지는 효과
          scale.value = withTiming(1.03, {
            duration: 120,
            easing: Easing.out(Easing.ease),
          });

          setTimeout(() => {
            if (onNextProfile) {
              const action = direction === 'right' ? 'like' : 'dislike';
              onNextProfile(action);
            }
          }, 80);

          onSwipeUpdate(null, 0);
        } else {
          // 매우 부드러운 복원 애니메이션
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 250,
            mass: 0.7,
          });
          scale.value = withSpring(1, {
            damping: 20,
            stiffness: 250,
            mass: 0.7,
          });
          onSwipeUpdate(null, 0);
        }
      },
      onPanResponderTerminate: () => {
        // 제스처가 중단되었을 때 부드럽게 복원
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 250,
          mass: 0.7,
        });
        scale.value = withSpring(1, {
          damping: 20,
          stiffness: 250,
          mass: 0.7,
        });
        onSwipeUpdate(null, 0);
      },
    });

    // 버튼 클릭 시 스와이프 애니메이션 실행 함수
    const triggerButtonSwipe = (direction: 'left' | 'right') => {
      console.log(`triggerButtonSwipe 호출 - direction: ${direction}`);

      const exitX = direction === 'right' ? 1200 : -1200; // 이동 거리를 더 크게

      // 더 부드럽고 자연스러운 애니메이션
      translateX.value = withTiming(exitX, {
        duration: 400, // 더 부드럽게 400ms
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // 베지어 곡선으로 더 자연스럽게
      });

      // 살짝 확대되면서 사라지는 효과
      scale.value = withTiming(1.05, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });

      // 버튼 클릭의 경우 onNextProfile을 호출하지 않음 (중복 API 호출 방지)

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
          { rotate: `${translateX.value * 0.05}deg` }, // 회전 효과: 더 부드럽게 (0.08 → 0.05)
        ],
      };
    });

    return (
      // PanResponder로 제스처 감지
      <Animated.View
        style={animatedStyle}
        className="flex-1 bg-white mb-16"
        {...panResponder.panHandlers}
      >
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
            source={{ uri: profileImageUrls[currentIndex] }}
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
                  {distance} km
                </Text>
              </View>
              {/* 망고 여부 - theyLiked가 true일 때만 표시 */}
              {theyLiked && (
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
              <View className="bg-mango-red/80 rounded-full px-4 py-1 flex-row items-center">
                <Text className="text-lg">
                  {getCategoryInfo(mainType)?.emoji || '❓'}
                </Text>
                <Text className="text-body-large-regular text-white ml-2">
                  {mainType}
                </Text>
              </View>
            </View>
            {/* 해시태그 */}
            <View className="flex-row flex-wrap">
              {keywords.map((keyword, idx) => (
                <Text
                  key={idx}
                  className="bg-white/20 rounded-full px-4 py-1.5 mr-2 text-small-semibold text-white"
                >
                  # {keyword}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }
);

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
