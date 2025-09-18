import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import Layout from '../../components/common/Layout';
import CustomHeader from '../../components/common/CustomHeader';
import EmailForm from '../../components/signup/EmailForm';
import PasswordForm from '../../components/signup/PasswordForm';
import BirthdateForm from '../../components/signup/BirthdateForm';
import GenderForm from '../../components/signup/GenderForm';
import LocationForm from '../../components/signup/LocationForm';
import SignupButton from '../../components/signup/SignupButton';
import { useSignupAnimation } from '../../hooks/useSignupAnimation';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { currentStep, goToNextStep, goToPrevStep, getTransform } = useSignupAnimation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const handleNext = () => {
    // 각 단계별 유효성 검사
    if (currentStep === 'email' && !email.trim()) return;
    if (currentStep === 'password' && (!password.trim() || password !== confirmPassword)) {
      alert('비밀번호를 확인해주세요.');
      return;
    }
    if (currentStep === 'birthdate' && !birthdate.trim()) {
      alert('생년월일을 입력해주세요.');
      return;
    }
    if (currentStep === 'gender' && !gender) {
      alert('성별을 선택해주세요.');
      return;
    }
    if (currentStep === 'location' && (!city || !district)) {
      alert('위치를 선택해주세요.');
      return;
    }

    // 마지막 단계가 아니면 다음 단계로 이동
    if (currentStep !== 'location') {
      goToNextStep();
    } else {
      // 회원가입 완료
      console.log('회원가입 완료:', { email, password, birthdate, gender, city, district });
      navigation.navigate('SignupComplete');
    }
  };

  const handleBack = () => {
    // 첫 번째 단계가 아니면 이전 단계로 이동
    if (currentStep !== 'email') {
      goToPrevStep();
    } else {
      navigation.goBack();
    }
  };

  // 각 단계별 transform 값
  const emailTransform = getTransform('email');
  const passwordTransform = getTransform('password');
  const birthdateTransform = getTransform('birthdate');
  const genderTransform = getTransform('gender');
  const locationTransform = getTransform('location');

  return (
    <KeyboardAvoidingView 
    className="flex-1"
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <CustomHeader
      title="회원가입"
      onBackPress={handleBack}
    />
      
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
            />
          </Animated.View>

          {/* 성별 폼 */}
          <Animated.View 
            className="absolute inset-0"
            style={{
              transform: [{ translateX: genderTransform }],
            }}
          >
            <GenderForm
              selectedGender={gender}
              onGenderSelect={setGender}
            />
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
              onCityPress={() => {
                // 임시로 서울시 설정
                setCity('서울시');
              }}
              onDistrictPress={() => {
                // 임시로 강남구 설정
                setDistrict('강남구');
              }}
            />
          </Animated.View>
        </View>

        {/* 버튼 영역 */}
        <SignupButton
          isActive={
            currentStep === 'email' ? !!email : 
            currentStep === 'password' ? !!password : 
            currentStep === 'birthdate' ? !!birthdate :
            currentStep === 'gender' ? !!gender :
            !!(city && district)
          }
          onPress={handleNext}
          text={currentStep === 'location' ? '가입 완료' : '다음'}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
