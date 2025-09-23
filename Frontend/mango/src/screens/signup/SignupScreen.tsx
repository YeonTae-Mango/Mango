import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Layout from '../../components/common/Layout';
import CustomHeader from '../../components/common/CustomHeader';
import EmailForm from '../../components/signup/EmailForm';
import PasswordForm from '../../components/signup/PasswordForm';
import BirthdateForm from '../../components/signup/BirthdateForm';
import GenderForm from '../../components/signup/GenderForm';
import LocationForm from '../../components/signup/LocationForm';
import RadiusForm from '../../components/signup/RadiusForm';
import SignupButton from '../../components/signup/SignupButton';
import { useSignupAnimation } from '../../hooks/useSignupAnimation';
import {
  useSignup,
  transformFormDataToSignupRequest,
} from '../../hooks/useSignup';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { currentStep, goToNextStep, goToPrevStep, getTransform } =
    useSignupAnimation();

  // 회원가입 훅 사용
  const { signup, isLoading, error, isSuccess, clearError } = useSignup();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [latitude, setLatitude] = useState(37.5013);
  const [longitude, setLongitude] = useState(127.0396);
  const [radius, setRadius] = useState(300);

  // 회원가입 성공 시 처리
  useEffect(() => {
    if (isSuccess) {
      console.log('🎉 회원가입 성공! 완료 화면으로 이동');
      navigation.navigate('SignupComplete');
    }
  }, [isSuccess, navigation]);

  // 에러 발생 시 알림 표시
  useEffect(() => {
    if (error) {
      console.log('❌ 회원가입 에러 발생:', error);
      Alert.alert('회원가입 실패', error, [
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

  const handleNext = useCallback(async () => {
    console.log('👆 다음 버튼 클릭 - 현재 단계:', currentStep);

    // 각 단계별 유효성 검사
    if (currentStep === 'email' && !email.trim()) {
      console.log('❌ 이메일 입력 필요');
      return;
    }
    if (
      currentStep === 'password' &&
      (!password.trim() || password !== confirmPassword)
    ) {
      console.log('❌ 비밀번호 확인 필요');
      Alert.alert('입력 오류', '비밀번호를 확인해주세요.');
      return;
    }
    if (currentStep === 'birthdate' && !birthdate.trim()) {
      console.log('❌ 생년월일 입력 필요');
      Alert.alert('입력 오류', '생년월일을 입력해주세요.');
      return;
    }
    if (currentStep === 'gender' && !gender) {
      console.log('❌ 성별 선택 필요');
      Alert.alert('입력 오류', '성별을 선택해주세요.');
      return;
    }
    if (currentStep === 'location' && (!city || !district)) {
      console.log('❌ 위치 선택 필요');
      Alert.alert('입력 오류', '위치를 선택해주세요.');
      return;
    }
    if (currentStep === 'radius' && radius < 100) {
      console.log('❌ 반경 설정 필요');
      Alert.alert('입력 오류', '반경을 설정해주세요.');
      return;
    }

    // 마지막 단계가 아니면 다음 단계로 이동
    if (currentStep !== 'radius') {
      console.log('➡️ 다음 단계로 이동');
      goToNextStep();
    } else {
      // 회원가입 API 호출
      console.log('🚀 회원가입 API 호출 준비');
      console.log('🚀 현재 폼 데이터:', {
        email,
        password,
        birthdate,
        gender,
        city,
        district,
        latitude,
        longitude,
        radius,
      });

      // 폼 데이터를 API 요청 형식으로 변환
      const signupData = transformFormDataToSignupRequest({
        email,
        password,
        birthdate,
        gender,
        city,
        district,
        latitude,
        longitude,
        radius,
      });

      // 회원가입 API 호출
      await signup(signupData);
    }
  }, [
    currentStep,
    email,
    password,
    confirmPassword,
    birthdate,
    gender,
    city,
    district,
    latitude,
    longitude,
    radius,
    goToNextStep,
    signup,
  ]);

  const handleBack = useCallback(() => {
    // 첫 번째 단계가 아니면 이전 단계로 이동
    if (currentStep !== 'email') {
      goToPrevStep();
    } else {
      navigation.goBack();
    }
  }, [currentStep, goToPrevStep, navigation]);

  // 각 단계별 transform 값
  const emailTransform = getTransform('email');
  const passwordTransform = getTransform('password');
  const birthdateTransform = getTransform('birthdate');
  const genderTransform = getTransform('gender');
  const locationTransform = getTransform('location');
  const radiusTransform = getTransform('radius');

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader title="회원가입" onBackPress={handleBack} />

      <View className="flex-1 bg-white px-12 pt-1-">
        {/* 폼 영역 - 절대 위치로 겹치게 배치 */}
        <View className="flex-1">
          {/* 이메일 폼 */}
          <Animated.View
            className="absolute inset-0"
            style={{
              transform: [{ translateX: emailTransform }],
            }}
          >
            <EmailForm value={email} onChangeText={setEmail} />
          </Animated.View>

          {/* 비밀번호 폼 */}
          <Animated.View
            className="absolute inset-0"
            style={{
              transform: [{ translateX: passwordTransform }],
            }}
          >
            <PasswordForm
              password={password}
              confirmPassword={confirmPassword}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
            />
          </Animated.View>

          {/* 생년월일 폼 */}
          <Animated.View
            className="absolute inset-0"
            style={{
              transform: [{ translateX: birthdateTransform }],
            }}
          >
            <BirthdateForm value={birthdate} onChangeText={setBirthdate} />
          </Animated.View>

          {/* 성별 폼 */}
          <Animated.View
            className="absolute inset-0"
            style={{
              transform: [{ translateX: genderTransform }],
            }}
          >
            <GenderForm selectedGender={gender} onGenderSelect={setGender} />
          </Animated.View>

          {/* 위치 폼 */}
          <Animated.View
            className="absolute inset-0"
            style={{
              transform: [{ translateX: locationTransform }],
            }}
          >
            <LocationForm
              city={city}
              district={district}
              onLocationChange={(
                newCity,
                newDistrict,
                newLatitude,
                newLongitude
              ) => {
                setCity(newCity);
                setDistrict(newDistrict);
                setLatitude(newLatitude);
                setLongitude(newLongitude);
              }}
              onCityPress={() => {
                // 시/도 선택 로직 (필요시 구현)
                console.log('시/도 선택');
              }}
              onDistrictPress={() => {
                // 구/군 선택 로직 (필요시 구현)
                console.log('구/군 선택');
              }}
            />
          </Animated.View>

          {/* 반경 폼 */}
          <Animated.View
            className="absolute inset-0"
            style={{
              transform: [{ translateX: radiusTransform }],
            }}
          >
            <RadiusForm
              latitude={latitude}
              longitude={longitude}
              radius={radius}
              onRadiusChange={setRadius}
            />
          </Animated.View>
        </View>

        {/* 버튼 영역 */}
        <SignupButton
          isActive={
            currentStep === 'email'
              ? !!email
              : currentStep === 'password'
                ? !!password
                : currentStep === 'birthdate'
                  ? !!birthdate
                  : currentStep === 'gender'
                    ? !!gender
                    : currentStep === 'location'
                      ? !!(city && district)
                      : currentStep === 'radius'
                        ? radius >= 100
                        : false
          }
          onPress={handleNext}
          text={
            currentStep === 'radius'
              ? isLoading
                ? '가입 중...'
                : '가입 완료'
              : '다음'
          }
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
