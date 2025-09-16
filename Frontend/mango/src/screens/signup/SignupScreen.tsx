import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, Animated } from 'react-native';
import Layout from '../../components/common/Layout';
import CustomHeader from '../../components/common/CustomHeader';
import EmailForm from '../../components/signup/EmailForm';
import PasswordForm from '../../components/signup/PasswordForm';
import BirthdateForm from '../../components/signup/BirthdateForm';
import GenderForm from '../../components/signup/GenderForm';
import LocationForm from '../../components/signup/LocationForm';
import SignupButton from '../../components/signup/SignupButton';

type SignupStep = 'email' | 'password' | 'birthdate' | 'gender' | 'location';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  
  const emailSlideAnim = useRef(new Animated.Value(0)).current;
  const passwordSlideAnim = useRef(new Animated.Value(1)).current; // 우측에서 시작
  const birthdateSlideAnim = useRef(new Animated.Value(1)).current; // 우측에서 시작
  const genderSlideAnim = useRef(new Animated.Value(1)).current; // 우측에서 시작
  const locationSlideAnim = useRef(new Animated.Value(1)).current; // 우측에서 시작

  const handleNext = () => {
    if (currentStep === 'email') {
      if (!email.trim()) return;

      // 이메일 컴포넌트 좌측으로 사라지는 애니메이션
      Animated.timing(emailSlideAnim, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 비밀번호 컴포넌트 우측에서 들어오는 애니메이션
        setCurrentStep('password');
        Animated.timing(passwordSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentStep === 'password') {
      if (!password.trim() || password !== confirmPassword) {
        alert('비밀번호를 확인해주세요.');
        return;
      }

      // 비밀번호 컴포넌트 좌측으로 사라지는 애니메이션
      Animated.timing(passwordSlideAnim, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 생년월일 컴포넌트 우측에서 들어오는 애니메이션
        setCurrentStep('birthdate');
        Animated.timing(birthdateSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentStep === 'birthdate') {
      if (!birthdate.trim()) {
        alert('생년월일을 입력해주세요.');
        return;
      }

      // 생년월일 컴포넌트 좌측으로 사라지는 애니메이션
      Animated.timing(birthdateSlideAnim, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 성별 컴포넌트 우측에서 들어오는 애니메이션
        setCurrentStep('gender');
        Animated.timing(genderSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentStep === 'gender') {
      if (!gender) {
        alert('성별을 선택해주세요.');
        return;
      }

      // 성별 컴포넌트 좌측으로 사라지는 애니메이션
      Animated.timing(genderSlideAnim, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 위치 컴포넌트 우측에서 들어오는 애니메이션
        setCurrentStep('location');
        Animated.timing(locationSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentStep === 'location') {
      if (!city || !district) {
        alert('위치를 선택해주세요.');
        return;
      }
      
      // 회원가입 완료
      console.log('회원가입 완료:', { email, password, birthdate, gender, city, district });
      navigation.navigate('SignupComplete');
    }
  };

  const handleBack = () => {
    if (currentStep === 'location') {
      // 위치 컴포넌트 우측으로 사라지는 애니메이션
      Animated.timing(locationSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 성별 컴포넌트 좌측에서 들어오는 애니메이션
        setCurrentStep('gender');
        Animated.timing(genderSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentStep === 'gender') {
      // 성별 컴포넌트 우측으로 사라지는 애니메이션
      Animated.timing(genderSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 생년월일 컴포넌트 좌측에서 들어오는 애니메이션
        setCurrentStep('birthdate');
        Animated.timing(birthdateSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentStep === 'birthdate') {
      // 생년월일 컴포넌트 우측으로 사라지는 애니메이션
      Animated.timing(birthdateSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 비밀번호 컴포넌트 좌측에서 들어오는 애니메이션
        setCurrentStep('password');
        Animated.timing(passwordSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (currentStep === 'password') {
      // 비밀번호 컴포넌트 우측으로 사라지는 애니메이션
      Animated.timing(passwordSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 이메일 컴포넌트 좌측에서 들어오는 애니메이션
        setCurrentStep('email');
        Animated.timing(emailSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      navigation.goBack();
    }
  };

  // 애니메이션 변환값 계산
  const emailTransform = emailSlideAnim.interpolate({
    inputRange: [-1, 0],
    outputRange: [-400, 0],
  });

  const passwordTransform = passwordSlideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400],
  });

  const birthdateTransform = birthdateSlideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400],
  });

  const genderTransform = genderSlideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400],
  });

  const locationTransform = locationSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="회원가입"
        onBackPress={handleBack}
      />
      
      <View className="flex-1 bg-white px-12 pt-10">
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
    </Layout>
  );
}
