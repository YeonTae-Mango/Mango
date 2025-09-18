import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Layout from '../../components/common/Layout';
import SignupTitle from '../../components/signup/SignupTitle';
import SignupDescription from '../../components/signup/SignupDescription';
import CompleteButton from '../../components/signup/CompleteButton';

export default function SignupCompleteScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    // 프로필사진 업로드 화면으로 이동
    navigation.navigate('SignupProfilePhoto');
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
        <SignupTitle title="회원가입이 완료되었습니다" />

        {/* 안내 문구 */}
        <SignupDescription 
          description={`이제 프로필 사진을 등록하고\n내 계좌를 앱과 연동하면\n매칭을 시작할게요!`}
        />

        {/* 다음 버튼 */}
        <CompleteButton
          text="다음"
          onPress={handleNext}
          isActive={true}
        />
      </View>
    </Layout>
  );
}
