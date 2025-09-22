import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useCallback } from 'react';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import Layout from '../../components/common/Layout';
import CustomHeader from '../../components/common/CustomHeader';
import SignupButton from '../../components/signup/SignupButton';
import ProfileUploadForm from '../../components/signup/ProfileUploadForm';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';

export default function SignupProfilePhotoScreen() {
  const navigation = useNavigation<any>();

  // 사진 업로드 훅 사용
  const {
    selectedImages,
    isLoading,
    error,
    isSuccess,
    selectFromLibrary,
    takePhoto,
    removeImage,
    uploadPhotos,
    clearError,
  } = usePhotoUpload();

  // 사진 업로드 성공 시 처리
  useEffect(() => {
    if (isSuccess) {
      console.log('🎉 사진 업로드 성공! 다음 화면으로 이동');
      Alert.alert('성공', '프로필 사진이 업로드되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            // 다음 단계로 이동 (예: 계좌 연동 화면)
            navigation.navigate('SignupAccount');
          },
        },
      ]);
    }
  }, [isSuccess, navigation]);

  // 에러 발생 시 알림 표시
  useEffect(() => {
    if (error) {
      console.log('❌ 사진 업로드 에러 발생:', error);
      Alert.alert('업로드 실패', error, [
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
    console.log('👆 다음 버튼 클릭 - 사진 업로드 시작');

    // 사진이 선택되지 않았으면 건너뛰기 옵션 제공
    if (selectedImages.length === 0) {
      Alert.alert(
        '프로필 사진',
        '프로필 사진을 추가하지 않고 계속하시겠습니까?',
        [
          {
            text: '건너뛰기',
            onPress: () => {
              console.log('⏭️ 사진 업로드 건너뛰기 - 다음 화면으로 이동');
              navigation.navigate('SignupAccount');
            },
          },
          {
            text: '사진 선택',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    console.log('📸 선택된 사진 개수:', selectedImages.length);

    try {
      // 사진 업로드 실행
      await uploadPhotos();
    } catch (error) {
      console.log('❌ 사진 업로드 실패, 하지만 회원가입은 계속 진행');
      // 사진 업로드가 실패해도 회원가입은 계속 진행
      Alert.alert(
        '사진 업로드 실패',
        '사진 업로드에 실패했지만 회원가입을 계속 진행하시겠습니까?',
        [
          {
            text: '계속하기',
            onPress: () => {
              console.log('⏭️ 사진 업로드 실패해도 계속 진행');
              navigation.navigate('SignupAccount');
            },
          },
          {
            text: '다시 시도',
            onPress: () => {
              console.log('🔄 사진 업로드 재시도');
              uploadPhotos();
            },
          },
        ]
      );
    }
  }, [selectedImages.length, uploadPhotos, navigation]);

  const handlePhotoUpload = useCallback(() => {
    console.log('📷 사진 선택 옵션 표시');

    // 사진 선택 옵션 표시
    Alert.alert('사진 선택', '프로필 사진을 어떻게 추가하시겠습니까?', [
      {
        text: '갤러리에서 선택',
        onPress: () => {
          console.log('📱 갤러리에서 선택');
          selectFromLibrary();
        },
      },
      {
        text: '카메라로 촬영',
        onPress: () => {
          console.log('📷 카메라로 촬영');
          takePhoto();
        },
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ]);
  }, [selectFromLibrary, takePhoto]);

  const handlePhotoRemove = useCallback(
    (index: number) => {
      console.log('🗑️ 사진 제거 요청:', index);

      Alert.alert('사진 삭제', '선택한 사진을 삭제하시겠습니까?', [
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            console.log('✅ 사진 삭제 확인');
            removeImage(index);
          },
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ]);
    },
    [removeImage]
  );

  return (
    <Layout showHeader={false}>
      <CustomHeader title="회원가입" onBackPress={() => navigation.goBack()} />

      <View className="flex-1 bg-white px-12 pt-10">
        {/* 제목 */}
        <View className="mb-8">
          <Text className="text-subheading-bold text-text-primary mb-2">
            프로필에 보여줄 사진
          </Text>
          <Text className="text-body-large-regular text-text-secondary">
            최소 1장을 업로드해주세요
          </Text>
        </View>

        {/* 사진 그리드 (2x2) */}
        <ProfileUploadForm
          photos={selectedImages.map(img => img.uri)} // URI 배열로 변환
          onPhotoUpload={handlePhotoUpload}
          onPhotoRemove={handlePhotoRemove}
        />

        {/* 다음 버튼 */}
        <SignupButton
          text={isLoading ? '업로드 중...' : '다음'}
          onPress={handleNext}
          isActive={true} // 항상 활성화 (사진 없어도 건너뛸 수 있음)
          disabled={isLoading}
        />
      </View>
    </Layout>
  );
}
