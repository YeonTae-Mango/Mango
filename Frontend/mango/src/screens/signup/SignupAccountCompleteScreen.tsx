import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Layout from '../../components/common/Layout';
import SignupTitle from '../../components/signup/SignupTitle';
import SignupDescription from '../../components/signup/SignupDescription';
import CompleteButton from '../../components/signup/CompleteButton';
import { useAuthStore } from '../../store/authStore';

interface SignupAccountCompleteScreenProps {
  onLoginSuccess: () => void;
}

export default function SignupAccountCompleteScreen({
  onLoginSuccess,
}: SignupAccountCompleteScreenProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { setSignupInProgress } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 회원가입 완료 처리 시작');

      // 회원가입 진행 상태 해제 (이제 정식 로그인 상태로 전환)
      setSignupInProgress(false);

      console.log('✅ 회원가입 완료 - 홈 화면으로 이동');

      // 약간의 지연을 두고 홈으로 이동 (상태 업데이트 완료 대기)
      setTimeout(() => {
        onLoginSuccess();
      }, 100);
    } catch (error: any) {
      console.error('❌ 회원가입 완료 처리 실패:', error);
      Alert.alert('오류', '회원가입 완료 처리 중 오류가 발생했습니다.', [
        {
          text: '확인',
          onPress: () => {
            // 에러가 발생해도 홈으로 이동
            setSignupInProgress(false);
            setTimeout(() => {
              onLoginSuccess();
            }, 100);
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // CustomHeader와 동일한 높이 계산
  const headerHeight = Math.max(insets.top, 16) + 16 + 48; // SafeArea + padding + content height

  return (
    <Layout showHeader={false}>
      <View
        className="flex-1 bg-white px-12"
        style={{ paddingTop: headerHeight }}
      >
        {/* 성공 아이콘 */}
        <View className="items-center mt-20 mb-10">
          <View className="w-24 h-24 bg-green-400 rounded-full items-center justify-center mb-8">
            <Text className="text-white text-4xl font-bold">✓</Text>
          </View>
        </View>

        {/* 메인 제목 */}
        <SignupTitle title="계좌 연동이 완료되었습니다" />

        {/* 안내 문구 */}
        <SignupDescription description="이제 새로운 사람들을 확인하세요!" />

        {/* 다음 버튼 */}
        <CompleteButton
          text={isLoading ? '완료 중...' : '시작하기'}
          onPress={handleNext}
          isActive={true}
          disabled={isLoading}
        />
      </View>
    </Layout>
  );
}
