import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { updateUserDistance } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

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
  const { user } = useAuthStore();
  const slideAnim = useRef(new Animated.Value(300)).current;
  // RadiusForm과 동일한 거리 옵션들 (m 단위)
  const distanceOptions = [1000, 3000, 5000, 10000, 30000, 50000, 100000]; // 1km, 3km, 5km, 10km, 30km, 50km, 100km
  const [distanceIndex, setDistanceIndex] = useState(3); // 기본 10km (인덱스 3)
  const currentDistance = distanceOptions[distanceIndex];

  // 거리 업데이트 뮤테이션
  const updateDistanceMutation = useMutation({
    mutationFn: (distance: number) => {
      if (!user?.id) {
        throw new Error('사용자 정보가 없습니다.');
      }
      return updateUserDistance(user.id, distance);
    },
    onSuccess: () => {
      console.log('✅ 거리 업데이트 성공');
      Alert.alert('완료', '매칭 거리가 성공적으로 변경되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            onConfirm(Math.round(currentDistance / 1000));
            onClose();
          },
        },
      ]);
    },
    onError: error => {
      console.error('❌ 거리 업데이트 실패:', error);
      Alert.alert('오류', '거리 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });

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
    const distanceInKm = Math.round(currentDistance / 1000);
    console.log('🗺️ 거리 업데이트 시작:', distanceInKm, 'km');
    updateDistanceMutation.mutate(distanceInKm);
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
              <View className="mx-10">
                <View className="flex-row items-center justify-between">
                  <Text className="text-subheading-bold font-medium">
                    최대 거리 조정
                  </Text>
                  <View className="bg-mango-primary px-4 py-1 rounded-full flex-row items-center">
                    <Ionicons name="location-outline" size={14} color="white" />
                    <Text className="text-white text-body-large-regular ml-1">
                      {Math.round(currentDistance / 1000)}km
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
                    onValueChange={value => {
                      const newIndex = Math.round(value);
                      setDistanceIndex(newIndex);
                    }}
                    minimumTrackTintColor="#FF6D60"
                    maximumTrackTintColor="#F3F4F6"
                    thumbTintColor="#FF6D60"
                    step={1}
                  />
                </View>
              </View>

              {/* 확인 버튼 */}
              <TouchableOpacity
                className={`py-6 my-6 rounded-2xl ${
                  updateDistanceMutation.isPending
                    ? 'bg-gray-400'
                    : 'bg-mango-red'
                }`}
                onPress={handleConfirm}
                disabled={updateDistanceMutation.isPending}
              >
                {updateDistanceMutation.isPending ? (
                  <View className="flex-row justify-center items-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-subheading-regular text-white text-center ml-2">
                      변경 중...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-subheading-regular text-white text-center">
                    확인
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
