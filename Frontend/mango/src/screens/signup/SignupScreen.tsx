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
  const [radius, setRadius] = useState(1000);

  // 에러 상태 관리
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');

  // 이메일 유효성 검증
  const validateEmail = useCallback((email: string) => {
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  }, []);

  // 비밀번호 유효성 검증
  const validatePassword = useCallback(
    (password: string, confirmPassword: string) => {
      if (!password.trim()) {
        setPasswordError('비밀번호를 입력해주세요.');
        return false;
      } else if (password.length < 6) {
        setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
        return false;
      } else if (password !== confirmPassword) {
        setPasswordError('비밀번호가 일치하지 않습니다.');
        return false;
      } else {
        setPasswordError('');
        return true;
      }
    },
    []
  );

  // 생년월일 유효성 검증 (만 19세 이상)
  const validateBirthdate = useCallback((birthdate: string) => {
    console.log('🔍 생년월일 검증 시작:', birthdate);

    if (!birthdate.trim()) {
      setBirthdateError('생년월일을 입력해주세요.');
      return false;
    }

    // 생년월일 형식 변환: "2000 / 09 / 22" → Date 객체
    const formatBirthDate = (birthdate: string): Date => {
      const cleaned = birthdate.replace(/\s/g, '').replace(/\//g, '-');
      const [year, month, day] = cleaned.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    try {
      const birthDate = formatBirthDate(birthdate);
      const today = new Date();

      console.log('🔍 생년월일:', birthDate);
      console.log('🔍 오늘 날짜:', today);

      // 만 19세 계산
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      console.log('🔍 계산된 나이:', age);

      if (age < 19) {
        console.log('❌ 만 19세 미만 - 가입 불가');
        setBirthdateError('만 19세 이상만 가입 가능합니다.');
        return false;
      } else {
        console.log('✅ 만 19세 이상 - 가입 가능');
        setBirthdateError('');
        return true;
      }
    } catch (error) {
      console.log('❌ 생년월일 형식 오류:', error);
      setBirthdateError('올바른 생년월일 형식이 아닙니다.');
      return false;
    }
  }, []);

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

  // 실시간 유효성 검증
  useEffect(() => {
    if (currentStep === 'email' && email) {
      validateEmail(email);
    }
  }, [email, currentStep, validateEmail]);

  useEffect(() => {
    if (currentStep === 'password' && (password || confirmPassword)) {
      validatePassword(password, confirmPassword);
    }
  }, [password, confirmPassword, currentStep, validatePassword]);

  useEffect(() => {
    if (currentStep === 'birthdate' && birthdate) {
      validateBirthdate(birthdate);
    }
  }, [birthdate, currentStep, validateBirthdate]);

  const handleNext = useCallback(async () => {
    console.log('👆 다음 버튼 클릭 - 현재 단계:', currentStep);

    // 각 단계별 유효성 검사
    if (currentStep === 'email') {
      if (!validateEmail(email)) {
        console.log('❌ 이메일 유효성 검사 실패');
        return;
      }
    }
    if (currentStep === 'password') {
      if (!validatePassword(password, confirmPassword)) {
        console.log('❌ 비밀번호 유효성 검사 실패');
        return;
      }
    }
    if (currentStep === 'birthdate') {
      if (!validateBirthdate(birthdate)) {
        console.log('❌ 생년월일 유효성 검사 실패');
        return;
      }
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
            <EmailForm
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
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
              error={passwordError}
            />
          </Animated.View>

          {/* 생년월일 폼 */}
          <Animated.View
            className="absolute inset-0"
            style={{
              transform: [{ translateX: birthdateTransform }],
            }}
          >
            <BirthdateForm
              value={birthdate}
              onChangeText={setBirthdate}
              error={birthdateError}
            />
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
              ? !!email && !emailError
              : currentStep === 'password'
                ? !!password && !passwordError
                : currentStep === 'birthdate'
                  ? !!birthdate && !birthdateError
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
