import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ActionButtonsProps {
  onReject?: () => void;
  onMango?: () => void;
  // 스와이프 상태 props (HomeScreen에서 전달받음)
  swipeDirection?: 'left' | 'right' | null;
  swipeIntensity?: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onReject,
  onMango,
  swipeDirection,
  swipeIntensity = 0,
}) => {
  // 버튼 클릭 시 애니메이션을 위한 상태
  const [buttonPressed, setButtonPressed] = useState<'left' | 'right' | null>(
    null
  );

  // 버튼 클릭 핸들러 (시각적 피드백 포함)
  const handleRejectPress = () => {
    // 잠깐 피드백 애니메이션 표시
    setButtonPressed('left');
    setTimeout(() => setButtonPressed(null), 200); // 0.2초 후 초기화
    onReject?.(); // 실제 거절 액션 실행
  };

  const handleMangoPress = () => {
    // 잠깐 피드백 애니메이션 표시
    setButtonPressed('right');
    setTimeout(() => setButtonPressed(null), 200); // 0.2초 후 초기화
    onMango?.(); // 실제 좋아요 액션 실행
  };

  // 스와이프에 따른 버튼 크기 계산: 왼쪽 스와이프 시 X버튼이 커지고, 오른쪽 스와이프 시 하트버튼이 커짐(최대 1.3배)
  // 버튼 클릭 시에도 동일한 효과 적용
  const xButtonScale =
    (swipeDirection === 'left' ? 1 + swipeIntensity * 0.3 : 1) *
    (buttonPressed === 'left' ? 1.3 : 1); // 버튼 클릭 시 1.3배 확대

  const heartButtonScale =
    (swipeDirection === 'right' ? 1 + swipeIntensity * 0.3 : 1) *
    (buttonPressed === 'right' ? 1.3 : 1); // 버튼 클릭 시 1.3배 확대

  // X 버튼 애니메이션 스타일
  // useAnimatedStyle로 크기 변화 애니메이션 적용 (withSpring으로 부드러운 스프링 효과)
  const xButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(xButtonScale) }],
    };
  });

  // 하트 버튼 애니메이션 스타일
  // useAnimatedStyle로 크기 변화 애니메이션 적용 (withSpring으로 부드러운 스프링 효과)
  const heartButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(heartButtonScale) }],
    };
  });

  // X 버튼 색상 변화
  // 왼쪽 스와이프 강도가 30% 이상이거나 버튼이 클릭되었을 때 녹색으로 변경
  const xButtonBgColor =
    (swipeDirection === 'left' && swipeIntensity > 0.3) ||
    buttonPressed === 'left'
      ? 'bg-mango-teal' // 스와이프 시 또는 클릭 시: 녹색
      : 'bg-gray'; // 기본 상태: 회색

  // X 버튼 아이콘 색상도 함께 변경
  const xIconColor =
    (swipeDirection === 'left' && swipeIntensity > 0.3) ||
    buttonPressed === 'left'
      ? 'white' // 스와이프 시 또는 클릭 시: 흰색
      : '#8899A8'; // 기본 상태: 회색

  // 하트 버튼 색상 변화
  // 오른쪽 스와이프 강도가 30% 이상이거나 버튼이 클릭되었을 때 그라디언트로 변경
  const isHeartActive =
    (swipeDirection === 'right' && swipeIntensity > 0.3) ||
    buttonPressed === 'right';

  return (
    <View className="flex-row justify-center items-end">
      {/* X 버튼 (거절) - 왼쪽 스와이프 시 반응 */}
      <Animated.View style={xButtonAnimatedStyle}>
        <TouchableOpacity
          className={`${xButtonBgColor} rounded-full w-20 h-20 items-center justify-center mr-12`}
          onPress={handleRejectPress}
        >
          <Ionicons name="close" size={30} color={xIconColor} />
        </TouchableOpacity>
      </Animated.View>

      {/* 하트 버튼 (좋아요) - 오른쪽 스와이프 시 반응 */}
      <Animated.View style={heartButtonAnimatedStyle}>
        {isHeartActive ? (
          // 스와이프 시: LinearGradient로 그라디언트 적용
          <LinearGradient
            colors={['#FF6D60', '#F1B31B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              className="rounded-full w-20 h-20 items-center justify-center"
              onPress={handleMangoPress}
            >
              <Ionicons name="heart" size={30} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          // 기본 상태: 망고 레드
          <TouchableOpacity
            className="bg-mango-red rounded-full w-20 h-20 items-center justify-center"
            onPress={handleMangoPress}
          >
            <Ionicons name="heart" size={30} color="white" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default ActionButtons;
