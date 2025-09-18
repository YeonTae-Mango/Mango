import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Layout from '../../components/common/Layout';
import CustomHeader from '../../components/common/CustomHeader';

interface BaseScreenProps {
  onLoginSuccess?: () => void;
}

export default function BaseScreen({ onLoginSuccess }: BaseScreenProps) {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 로직 구현
    console.log('로그인 시도:', { email, password });
    
    // 로그인 성공 시 onLoginSuccess 호출
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="로그인"
        onBackPress={() => navigation.goBack()}
      />
      
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
          />
          
          <TextInput
            className="h-14 bg-gray rounded-xl px-4 text-base"
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity
          className={`h-14 rounded-xl justify-center items-center mb-10 ${
            email && password ? 'bg-mango-red' : 'bg-stroke'
          }`}
          onPress={handleLogin}
          disabled={!email || !password}
        >
          <Text className={`text-base font-semibold ${
            email && password ? 'text-white' : 'text-secondary'
          }`}>
            로그인
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
          <TouchableOpacity onPress={handleSignup}>
            <Text className="text-sm text-mango-red font-semibold">회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}

