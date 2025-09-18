import React, { useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';

interface AccountTermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export default function AccountTermsModal({ 
  visible, 
  onClose, 
  onAgree 
}: AccountTermsModalProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View 
          className="bg-white rounded-t-3xl"
          style={{ transform: [{ translateY }] }}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
          {/* 드래그 핸들 */}
          <View className="items-center py-6">
            <View className="w-20 h-1 bg-black rounded-full" />
          </View>
          
          {/* 모달 내용 */}
          <View className="px-6 pb-10">
            {/* 제목 */}
            <Text className="text-heading-bold text-text-primary mb-6 text-center">
              계좌정보 연동 관련 약관
            </Text>
            
            {/* 안내 문구 */}
            <Text className="text-body-large-semibold text-text-primary text-center">
              서비스 시작을 위해 먼저
            </Text>

            <Text className="text-body-large-semibold text-text-primary mb-6 text-center">
              본인의 계좌를 서비스와 연동해주세요
            </Text>
            
            {/* 약관 내용 */}
            <ScrollView className="max-h-60 mb-10">
              <Text className="text-body-medium-regular text-text-primary leading-6">
                중앙선거관리위원회는 법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며, 법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다. 모든 국민의 재산권은 보장된다. 그 내용과 한계는 법률로 정한다. 국회의 동의를 얻어 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다.
              </Text>
            </ScrollView>
            
            {/* 동의 버튼 */}
            <TouchableOpacity
              className="h-14 bg-mango-red rounded-xl justify-center items-center"
              onPress={onAgree}
            >
              <Text className="text-base font-semibold text-white">
                동의
              </Text>
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
