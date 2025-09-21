import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface NoMoreProfilesModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (distance: number) => void;
}

export default function NoMoreProfilesModal({
  visible,
  onClose,
  onConfirm,
}: NoMoreProfilesModalProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const distanceOptions = [5, 10, 15, 20, 30, 40, 50];
  const [distanceIndex, setDistanceIndex] = useState(1); // 기본 10km (인덱스 1)
  const distance = distanceOptions[distanceIndex];

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

  const handleConfirm = () => {
    onConfirm(distance);
    onClose();
  };

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
                상대방과의 최대 거리를 조정하거나,{'\n'}
                상대방의 망고를 기다려주세요.
              </Text>

              {/* 거리 조정 섹션 */}
              <View className="mx-6">
                <View className="flex-row items-center justify-between">
                  <Text className="text-subheading-bold font-medium">
                    최대 거리 조정
                  </Text>
                  <View className="bg-mango-primary px-4 py-1 rounded-full">
                    <Text className="text-white text-body-large-regular">
                      {distance}km
                    </Text>
                  </View>
                </View>

                {/* 슬라이더 영역 */}
                <View className="my-4">
                  <Slider
                    style={{
                      width: '100%',
                      height: 40,
                    }}
                    minimumValue={0}
                    maximumValue={6}
                    value={distanceIndex}
                    onValueChange={value => setDistanceIndex(Math.round(value))}
                    minimumTrackTintColor="#FF6D60"
                    maximumTrackTintColor="#F3F4F6"
                    thumbTintColor="#FF6D60"
                    step={1}
                  />
                </View>
              </View>

              {/* 확인 버튼 */}
              <TouchableOpacity
                className="bg-mango-red py-6 my-6 rounded-2xl"
                onPress={handleConfirm}
              >
                <Text className="text-subheading-regular text-white text-center">
                  확인
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
