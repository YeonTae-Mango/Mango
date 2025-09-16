import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/common/Layout';

interface SignupCompleteScreenProps {
  onLoginSuccess: () => void;
}

export default function SignupCompleteScreen({ onLoginSuccess }: SignupCompleteScreenProps) {
  const navigation = useNavigation<any>();

  const handleNext = () => {
    // 로그인 상태로 변경하여 메인 화면으로 이동
    onLoginSuccess();
  };

  return (
    <Layout showHeader={false}>
      <View className="flex-1 bg-white px-12 pt-20">
        {/* 성공 아이콘 */}
        <View className="items-center mb-16">
          <View className="w-24 h-24 bg-green-400 rounded-full items-center justify-center mb-8">
            <Text className="text-white text-4xl font-bold">✓</Text>
          </View>
        </View>

        {/* 메인 제목 */}
        <View className="mb-8">
          <Text className="text-heading-bold text-text-primary text-center">
            회원가입이 완료되었습니다
          </Text>
        </View>

        {/* 안내 문구 */}
        <View className="mb-16">
          <Text className="text-base text-text-primary text-center leading-6">
            이제 프로필 사진을 등록하고{'\n'}
            내 계좌를 앱과 연동하면{'\n'}
            매칭을 시작할게요!
          </Text>
        </View>

        {/* 다음 버튼 */}
        <View className="flex-1 justify-end pb-20">
          <TouchableOpacity
            className="h-14 bg-mango-red rounded-xl justify-center items-center"
            onPress={handleNext}
          >
            <Text className="text-base font-semibold text-white">
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
