import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Layout from '../../components/common/Layout';
import CustomHeader from '../../components/common/CustomHeader';
import SignupButton from '../../components/signup/SignupButton';
import ProfileUploadForm from '../../components/signup/ProfileUploadForm';

export default function SignupProfilePhotoScreen() {
  const navigation = useNavigation<any>();
  const [photos, setPhotos] = useState<string[]>([]);

  const handleNext = () => {
    // 최소 1장의 사진이 업로드되었는지 확인
    if (photos.length === 0) {
      alert('최소 1장의 사진을 업로드해주세요.');
      return;
    }
    
    console.log('프로필 사진 업로드 완료:', photos);
    // 다음 단계로 이동 (예: 계좌 연동 화면)
    navigation.navigate('SignupAccount');
  };

  const handlePhotoUpload = () => {
    // 최대 4개 사진 제한 확인
    if (photos.length >= 4) {
      alert('최대 4장까지만 업로드할 수 있습니다.');
      return;
    }
    
    // 실제 구현에서는 이미지 선택 로직을 구현
    console.log(`사진 업로드: ${photos.length + 1}번째 사진`);
    // 임시로 플레이스홀더 이미지 추가
    const newPhotos = [...photos, `photo_${photos.length + 1}`];
    setPhotos(newPhotos);
  };

  const handlePhotoRemove = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="회원가입"
        onBackPress={() => navigation.goBack()}
      />
      
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
          photos={photos}
          onPhotoUpload={handlePhotoUpload}
          onPhotoRemove={handlePhotoRemove}
        />

        {/* 다음 버튼 */}
        <SignupButton
          text="다음"
          onPress={handleNext}
          isActive={photos.length > 0}
        />
      </View>
    </Layout>
  );
}
