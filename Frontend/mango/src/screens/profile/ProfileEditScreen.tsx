import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileTab from '../../components/profile/ProfileTab';
import ProfileUploadForm from '../../components/signup/ProfileUploadForm';

export default function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [photos, setPhotos] = useState<string[]>(['photo1', 'photo2', 'photo3']); // 더미 데이터
  const [oneWord, setOneWord] = useState('아 싸탈하고 싶다');
  // 거리 옵션들 (7개 스텝)
  const distanceOptions = [1, 3, 5, 10, 30, 50, 100];
  // 각 거리별 소요 시간 (분)
  const timeRanges = [
    { min: 2, max: 3 },   // 1km
    { min: 4, max: 6 },   // 3km
    { min: 10, max: 15 },   // 5km
    { min: 25, max: 35 }, // 10km
    { min: 45, max: 60 }, // 30km
    { min: 60, max: 75 }, // 50km
    { min: 70, max: 90 }, // 100km
  ];
  const [distanceIndex, setDistanceIndex] = useState(3); // 기본값: 10km (인덱스 3)
  const distance = distanceOptions[distanceIndex];
  const timeRange = timeRanges[distanceIndex];
  const basicInfo = '나나 / 28 / 여';
  const city = '서울시';
  const district = '강남구';

  const handlePhotoUpload = () => {
    // 임시로 더미 사진 추가 (실제 구현에서는 이미지 선택 로직)
    const newPhoto = `photo${photos.length + 1}`;
    setPhotos(prev => [...prev, newPhoto]);
    console.log('사진 업로드:', newPhoto);
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };


  // 탭 상태에 따른 API 호출
  const handleTabChange = (tab: 'edit' | 'preview') => {
    setActiveTab(tab);
    // TODO: 탭에 따라 다른 API 호출
  };

  const handleComplete = () => {
    // 프로필 수정 완료 로직
    console.log('프로필 수정 완료');
    navigation.goBack();
  };

  // 미리보기용 프로필 데이터
  const profileData = {
    name: '나나',
    age: 28,
    distance: '21km',
    category: '핫플헌터',
    tags: ['카페인중독', '인터넷쇼핑', '단발병'],
    introduction: '"아 싸탈하고 싶다"',
    images: [
      'https://postfiles.pstatic.net/MjAyNDA4MDVfMTcx/MDAxNzIyODMzNDI0MzY5.wuG29NRvdZ6kQc0I6xhLTi-AeKIehY4AMD_rvRo6bBog.Aw-JsI21ibU34Wj-YJj-wXoirkPwbTBIT_KyNyzc4hgg.JPEG/IMG_2048.JPG?type=w966'
    ]
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="프로필 수정"
        onBackPress={() => navigation.goBack()}
        showMoreButton={true}
        onMorePress={handleComplete}
        moreIcon="checkmark"
      />

      <ScrollView className="flex-1 bg-white">
        {/* ProfileTab */}
        <ProfileTab
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* 탭에 따른 내용 렌더링 */}
        {activeTab === 'edit' ? (
          <>
            {/* 프로필 사진 섹션 */}
            <View className="mb-8 mt-4 px-4">
              <Text className="text-subheading-bold text-text-primary mb-4">프로필 사진</Text>
              <ProfileUploadForm
                photos={photos}
                onPhotoUpload={handlePhotoUpload}
                onPhotoRemove={handlePhotoRemove}
              />
            </View>

            {/* 기본 정보 섹션 */}
            <View className="mb-12 px-4">
              <Text className="text-subheading-bold text-text-primary mb-4">기본 정보</Text>
                <View className="h-14 bg-gray rounded-xl px-4 justify-center">
                  <Text className="text-body-large-regular text-text-primary">{basicInfo}</Text>
                </View>
            </View>

            {/* 한 마디 섹션 */}
            <View className="mb-12 px-4">
              <Text className="text-subheading-bold text-text-primary mb-4">한 마디</Text>
                <View className="h-14 border border-mango-red rounded-xl px-4 justify-center">
                  <TextInput className="text-body-large-regular text-text-primary" value={oneWord} onChangeText={setOneWord} />
                </View>
            </View>

            {/* 위치 정보 섹션 */}
            <View className="mb-12 px-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-subheading-bold text-text-primary">위치 정보</Text>
                <TouchableOpacity>
                  <Text className="text-body-large-semibold text-mango-red">위치 업데이트</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex-row gap-4">
                {/* 시/도 */}
                <View className="flex-1 h-14 bg-gray rounded-xl px-4 justify-center">
                  <Text className="text-body-large-regular text-text-primary text-center">{city}</Text>
                </View>

                {/* 구/군 */}
                <View className="flex-1 h-14 bg-gray rounded-xl px-4 justify-center">
                  <Text className="text-body-large-regular text-text-primary text-center">{district}</Text>
                </View>
              </View>
            </View>

            {/* 상대방과의 거리 섹션 */}
            <View className="mb-12 px-4">
              <Text className="text-subheading-bold text-text-primary mb-8">희망하는 반경</Text>
              
              {/* 슬라이더 영역 */}
              <View className="mb-4">
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={6}
                  value={distanceIndex}
                  onValueChange={(value) => setDistanceIndex(Math.round(value))}
                  minimumTrackTintColor="#FF6B6B"
                  maximumTrackTintColor="#E5E5E5"
                  thumbTintColor="#FF6B6B"
                  step={1}
                />
              </View>

              {/* 거리 표시 */}
              <View className="flex-row items-center justify-center gap-3">
                <View className="bg-mango-primary rounded-full px-4 py-1.5 flex-row items-center">
                  <Ionicons name="location-outline" size={14} color="white" />
                  <Text className="text-body-medium-semibold text-white ml-2">
                    {distance}km
                  </Text>
                </View>
                <Text className="text-body-large-regular text-text-primary">
                  자동차로 <Text className="font-bold">{timeRange.min}~{timeRange.max}분</Text> 정도 걸려요!
                </Text>
              </View>
            </View>
          </>
        ) : (
          /* 미리보기 모드 - ProfileCard 표시 */
          <ProfileCard
            name={profileData.name}
            age={profileData.age}
            distance={profileData.distance}
            category={profileData.category}
            tags={profileData.tags}
            introduction={profileData.introduction}
            images={profileData.images}
          />
        )}
      </ScrollView>
    </Layout>
  );
}

