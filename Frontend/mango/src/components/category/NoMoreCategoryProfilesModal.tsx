import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface NoMoreCategoryProfilesModalProps {
  visible: boolean;
  onClose: () => void;
  onGoBack: () => void;
  categoryName: string;
}

export default function NoMoreCategoryProfilesModal({
  visible,
  onClose,
  onGoBack,
  categoryName,
}: NoMoreCategoryProfilesModalProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <Animated.View
              className="bg-white rounded-t-2xl px-6 pt-4 pb-8"
              style={{
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* 핸들 */}
              <View className="items-center mb-6" {...panResponder.panHandlers}>
                <TouchableOpacity onPress={onClose}>
                  <View className="w-16 h-1 bg-text-secondary rounded-full" />
                </TouchableOpacity>
              </View>

              {/* 메인 메시지 */}
              <Text className="text-heading-bold text-dark text-center m-4">
                더이상 사람이 없어요!
              </Text>

              {/* X 아이콘 (원형 배경) */}
              <View className="items-center m-4">
                <LinearGradient
                  colors={['#F1B31B', '#FF6D60']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="close" size={50} color="white" />
                </LinearGradient>
              </View>

              {/* 서브 메시지 */}
              <Text className="text-body-large-regular text-center text-text-primary mt-4 mb-10 leading-6">
                {categoryName} 카테고리에는{'\n'}더 이상 매칭할 사람이 없어요.
                {'\n'}
                다른 유형을 살펴보세요!
              </Text>

              {/* 버튼들 */}
              <View className="space-y-3">
                {/* 다른 카테고리 보기 버튼 */}
                <TouchableOpacity
                  className="bg-mango-red py-4 rounded-2xl"
                  onPress={onGoBack}
                >
                  <Text className="text-subheading-regular text-white text-center">
                    다른 카테고리 보기
                  </Text>
                </TouchableOpacity>

                {/* 닫기 버튼 */}
                <TouchableOpacity
                  className="bg-gray-100 py-4 rounded-2xl"
                  onPress={onClose}
                >
                  <Text className="text-subheading-regular text-gray-600 text-center">
                    닫기
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
