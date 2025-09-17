import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface ChatMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onReportChat: () => void;
  onBlockUser: () => void;
  onReportUser: () => void;
}

export default function ChatMenuModal({
  visible,
  onClose,
  onReportChat,
  onBlockUser,
  onReportUser,
}: ChatMenuModalProps) {
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  const panResponder = React.useRef(
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

  React.useEffect(() => {
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

  const menuItems = [
    {
      icon: 'close-circle-outline',
      title: '상대방과 매치 취소하기',
      subtitle:
        '모든 대화 내용이 삭제됩니다. 상대방을 다시 마주칠 수도 있어요.',
      color: '#FF6B6B',
      onPress: onReportChat,
    },
    {
      icon: 'shield-outline',
      title: '상대방 차단하기',
      subtitle: '상대방을 차단하면 다시 마주칠 일이 없어요.',
      color: '#4CAF50',
      onPress: onBlockUser,
    },
    {
      icon: 'megaphone-outline',
      title: '상대방 신고하기',
      subtitle: '신고 사실을 상대방이 알 수 없어요.',
      color: '#FF9800',
      onPress: onReportUser,
    },
  ];

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
              className="bg-white rounded-t-2xl px-6 pt-4 pb-6"
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

              {/* 메뉴 아이템들 */}
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-start py-4"
                  onPress={() => {
                    item.onPress();
                    onClose();
                  }}
                >
                  <View className="w-12 h-12 justify-center items-center mr-4">
                    <Ionicons
                      name={item.icon as any}
                      size={30}
                      color={item.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body-medium-semibold text-dark mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-body-small-regular text-text-primary leading-5">
                      {item.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
