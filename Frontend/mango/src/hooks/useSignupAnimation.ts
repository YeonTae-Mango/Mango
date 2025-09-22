import { useRef, useState } from 'react';
import { Animated } from 'react-native';

type SignupStep = 'email' | 'password' | 'birthdate' | 'gender' | 'location' | 'radius';

const ANIMATION_DURATION = 300;

export function useSignupAnimation() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  
  // 모든 애니메이션 값을 하나의 배열로 관리
  const slideAnimations = useRef([
    new Animated.Value(0),   // email (0)
    new Animated.Value(1),   // password (1)
    new Animated.Value(1),   // birthdate (2)
    new Animated.Value(1),   // gender (3)
    new Animated.Value(1),   // location (4)
    new Animated.Value(1),   // radius (5)
  ]).current;

  const stepIndex: Record<SignupStep, number> = {
    email: 0,
    password: 1,
    birthdate: 2,
    gender: 3,
    location: 4,
    radius: 5,
  };

  // 애니메이션 실행 함수
  const animateToStep = (targetStep: SignupStep, direction: 'next' | 'prev') => {
    const currentIndex = stepIndex[currentStep];
    const targetIndex = stepIndex[targetStep];
    
    // 현재 단계를 화면 밖으로 이동
    Animated.timing(slideAnimations[currentIndex], {
      toValue: direction === 'next' ? -1 : 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      // 다음 단계로 변경
      setCurrentStep(targetStep);
      
      // 다음 단계를 화면 안으로 이동
      Animated.timing(slideAnimations[targetIndex], {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    });
  };

  // 다음 단계로 이동
  const goToNextStep = () => {
    const steps: SignupStep[] = ['email', 'password', 'birthdate', 'gender', 'location', 'radius'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      animateToStep(nextStep, 'next');
    }
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    const steps: SignupStep[] = ['email', 'password', 'birthdate', 'gender', 'location', 'radius'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      animateToStep(prevStep, 'prev');
    }
  };

  // 각 단계별 transform 값 계산
  const getTransform = (step: SignupStep) => {
    const index = stepIndex[step];
    const animValue = slideAnimations[index];
    
    if (step === 'email') {
      return animValue.interpolate({
        inputRange: [-1, 0],
        outputRange: [-400, 0],
      });
    } else if (step === 'radius') {
      return animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400],
      });
    } else {
      return animValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-400, 0, 400],
      });
    }
  };

  return {
    currentStep,
    goToNextStep,
    goToPrevStep,
    getTransform,
  };
}
