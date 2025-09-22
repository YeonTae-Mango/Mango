import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import {
  useLogin,
  transformFormDataToLoginRequest,
} from '../../hooks/useLogin';

interface BaseScreenProps {
  onLoginSuccess?: () => void;
}

export default function BaseScreen({ onLoginSuccess }: BaseScreenProps) {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading, error, isSuccess, clearError } = useLogin();

  // 로그인 성공 시 처리
  useEffect(() => {
    if (isSuccess) {
      console.log('🎉 로그인 성공! 다음 화면으로 이동');
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigation.navigate('Main'); // 또는 적절한 메인 화면으로 이동
      }
    }
  }, [isSuccess, onLoginSuccess, navigation]);

  // 에러 발생 시 알림 표시
  useEffect(() => {
    if (error) {
      console.log('❌ 로그인 에러 발생:', error);
      Alert.alert('로그인 실패', error, [
        {
          text: '확인',
          onPress: () => {
            console.log('🧹 에러 알림 확인 - 에러 상태 초기화');
            clearError();
          },
        },
      ]);
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    console.log('🔑 로그인 시도:', { email, password });

    // 폼 데이터를 API 요청 형식으로 변환
    const loginData = transformFormDataToLoginRequest({
      email,
      password,
      // fcmToken은 추후 FCM 구현 시 추가
    });

    // 로그인 실행
    await login(loginData);
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleTest = () => {
    navigation.navigate('Test');
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader title="로그인" onBackPress={() => navigation.goBack()} />

      <View className="flex-1 bg-white px-12 pt-10">
        {/* 입력 필드들 */}
        <View className="mb-16">
          <TextInput
            className="h-14 bg-gray rounded-xl px-4 text-base mb-4"
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <TextInput
            className="h-14 bg-gray rounded-xl px-4 text-base"
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity
          className={`h-14 rounded-xl justify-center items-center mb-10 ${
            email && password && !isLoading ? 'bg-mango-red' : 'bg-stroke'
          }`}
          onPress={handleLogin}
          disabled={!email || !password || isLoading}
        >
          <Text
            className={`text-base font-semibold ${
              email && password && !isLoading ? 'text-white' : 'text-secondary'
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Text>
        </TouchableOpacity>

        {/* 구분선 */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-stroke" />
          <Text className="mx-4 text-sm text-secondary">또는</Text>
          <View className="flex-1 h-px bg-stroke" />
        </View>

        {/* 회원가입 링크 */}
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-secondary">계정이 없으신가요? </Text>
          <TouchableOpacity onPress={handleSignup} disabled={isLoading}>
            <Text className="text-sm text-mango-red font-semibold">
              회원가입
            </Text>
          </TouchableOpacity>
        </View>

        {/* 테스트 버튼 */}
        <TouchableOpacity
          className="h-12 bg-blue-500 rounded-xl justify-center items-center"
          onPress={handleTest}
          disabled={isLoading}
        >
          <Text className="text-base font-semibold text-white">테스트</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
