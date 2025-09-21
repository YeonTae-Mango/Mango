import { Ionicons } from '@expo/vector-icons';
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

interface ReconnectionCompleteModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReconnectionCompleteModal({
  visible,
  onClose,
}: ReconnectionCompleteModalProps) {
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
                재연동 완료!
              </Text>

              {/* 체크 아이콘 (원형 배경) */}
              <View className="items-center m-4">
                <View
                  className="rounded-full items-center justify-center"
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    backgroundColor: '#98D8AA',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="checkmark" size={50} color="white" />
                </View>
              </View>

              {/* 서브 메시지 */}
              <Text className="text-body-large-regular text-center text-text-primary mt-4 mb-10 leading-6">
                연동이 완료되었습니다!{'\n'}
                새로운 데이터로 변경되었습니다!
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
