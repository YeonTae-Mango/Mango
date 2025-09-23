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
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // dx 또는 dy가 1px 이상 움직이면 감지
        return Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dy) > 1;
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.value = gestureState.dx;
        scale.value = 1 + Math.abs(gestureState.dx) * 0.0003;
        // 스와이프 정보 계산
        const swipeThreshold = 30;
        let direction: 'left' | 'right' | null = null;
        let intensity = 0;
        if (Math.abs(gestureState.dx) > swipeThreshold) {
          direction = gestureState.dx > 0 ? 'right' : 'left';
          intensity = Math.min(Math.abs(gestureState.dx) / 150, 1);
        }
        onSwipeUpdate(direction, intensity);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = 70;
        if (Math.abs(gestureState.dx) > threshold) {
          // 스와이프 완료
          const direction = gestureState.dx > 0 ? 'right' : 'left';
          const exitX = gestureState.dx > 0 ? 1000 : -1000;
          translateX.value = withTiming(exitX, { duration: 300 });
          setTimeout(() => {
            if (onNextProfile) {
              const action = direction === 'right' ? 'like' : 'dislike';
              onNextProfile(action);
            }
          }, 100);
          onSwipeUpdate(null, 0);
        } else {
          // 복원
          translateX.value = withSpring(0);
          scale.value = withSpring(1);
          onSwipeUpdate(null, 0);
        }
      },
    });

    // 버튼 클릭 시 스와이프 애니메이션 실행 함수
    const triggerButtonSwipe = (direction: 'left' | 'right') => {
      console.log(`triggerButtonSwipe 호출 - direction: ${direction}`);

      const exitX = direction === 'right' ? 1000 : -1000; // 화면 밖으로 이동할 거리

      // 카드를 화면 밖으로 부드럽게 이동
      translateX.value = withTiming(exitX, {
        duration: 300, // 0.3초 동안
        easing: Easing.out(Easing.quad), // 부드러운 감속 곡선
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
          { rotate: `${translateX.value * 0.08}deg` }, // 회전 효과: 더 부드럽게 기울어짐 (틴더 스타일)
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
              <View className="bg-mango-red rounded-full px-4 py-1 flex-row items-center">
                <Ionicons name="flame-outline" size={18} color="white" />
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
