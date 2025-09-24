import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import Slider from '@react-native-community/slider';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileTab from '../../components/profile/ProfileTab';
import ProfileImageDisplay from '../../components/profile/ProfileImageDisplay';
import { useAuthStore } from '../../store/authStore';
import { getUserProfile, UserProfile } from '../../api/profile';
import { uploadUserPhotos, PhotoUploadRequest } from '../../api/photos/photoApi';

export default function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoIds, setPhotoIds] = useState<number[]>([]); // 이미지 ID 저장
  const [oneWord, setOneWord] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
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
  
  // 현재 거리 설정 (API에서 받은 값으로 초기화)
  const [distanceIndex, setDistanceIndex] = useState(3); // 기본값: 10km (인덱스 3)
  const distance = distanceOptions[distanceIndex];
  const timeRange = timeRanges[distanceIndex];

  // 이미지 피커 옵션 설정
  const imagePickerOptions = {
    mediaType: 'photo' as MediaType,
    quality: 0.5 as const,
    maxWidth: 800,
    maxHeight: 800,
    includeBase64: false,
  };

  // 사용자 프로필 정보 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      console.log('🔄 프로필 로드 시작');
      console.log('👤 사용자 정보:', user);
      console.log('👤 사용자 ID:', user?.id);
      
      if (!user?.id) {
        console.warn('❌ 사용자 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('📡 API 호출 시작 - 사용자 ID:', user.id);
        const profile = await getUserProfile(user.id);
        console.log('📥 API 응답 받음:', profile);
        
        setUserProfile(profile);
        
        // 프로필 데이터로 상태 초기화
        setOneWord(profile.introduction || '');
        console.log('📸 profileImageUrls:', profile.profileImageUrls);
        console.log('📸 profileImageUrlsId:', profile.profileImageUrlsId);
        setPhotos(profile.profileImageUrls || []);
        setPhotoIds(profile.profileImageUrlsId || []);
        console.log('📸 photos 상태 설정 완료');
        
        // 거리 설정 초기화
        const distanceIdx = distanceOptions.findIndex(d => d === profile.distance / 1000);
        if (distanceIdx !== -1) {
          setDistanceIndex(distanceIdx);
        }
        
        console.log('✅ 프로필 정보 로드 완료:', profile);
      } catch (error) {
        console.error('❌ 프로필 정보 로드 실패:', error);
        Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.id]);

  const handlePhotoUpload = () => {
    console.log('📷 사진 선택 옵션 표시');

    // 최대 4장 제한 확인
    if (photos.length >= 4) {
      Alert.alert('알림', '최대 4장까지만 선택할 수 있습니다.');
      return;
    }

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
  };

  const handlePhotoRemove = (index: number) => {
    const imageId = photoIds[index];
    console.log('🗑️ 이미지 삭제 요청:', { index, imageId, imageUrl: photos[index] });
    
    // TODO: 서버에 DELETE 요청 보내기 (imageId가 -1이 아닌 경우)
    if (imageId !== -1) {
      console.log('📡 서버에 이미지 삭제 요청 예정:', imageId);
      // deleteImageFromServer(imageId);
    } else {
      console.log('ℹ️ 새로 업로드된 이미지 - 서버 삭제 요청 불필요');
    }
    
    // 로컬 상태에서 제거
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoIds(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * 선택된 이미지들을 서버에 업로드
   */
  const uploadSelectedImages = async (newImageUri: string) => {
    if (!user?.id) {
      console.error('❌ 사용자 ID가 없습니다.');
      Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setIsUploading(true);
      console.log('📤 이미지 업로드 시작:', newImageUri);

      // 새로 선택한 이미지만 업로드
      const photoData: PhotoUploadRequest = {
        files: [newImageUri],
      };

      const response = await uploadUserPhotos(user.id, photoData);
      
      if (response.status === 'SUCCESS' && response.data.length > 0) {
        console.log('✅ 이미지 업로드 성공:', response.data[0]);
        
        // 업로드된 이미지 URL을 photos 배열에 추가
        setPhotos(prev => [...prev, response.data[0]]);
        
        // TODO: 업로드 API에서 이미지 ID를 반환하도록 수정 필요
        // 현재는 임시로 -1 사용 (새로 업로드된 이미지임을 표시)
        setPhotoIds(prev => [...prev, -1]);
        
        Alert.alert('성공', '이미지가 업로드되었습니다.');
      } else {
        throw new Error('이미지 업로드에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('❌ 이미지 업로드 실패:', error);
      Alert.alert('업로드 실패', error.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 갤러리에서 사진 선택
   */
  const selectFromLibrary = () => {
    console.log('📱 갤러리에서 사진 선택 시작');

    launchImageLibrary(imagePickerOptions, async (response: ImagePickerResponse) => {
      console.log('📱 갤러리 선택 응답:', response);

      if (response.didCancel) {
        console.log('📱 사용자가 갤러리 선택을 취소했습니다.');
        return;
      }

      if (response.errorMessage) {
        console.error('📱 갤러리 선택 에러:', response.errorMessage);
        Alert.alert('오류', '사진을 선택할 수 없습니다.');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          console.log('✅ 갤러리에서 사진 선택 완료:', asset.uri);
          // 이미지 선택 후 서버에 업로드
          await uploadSelectedImages(asset.uri);
        }
      }
    });
  };

  /**
   * 카메라로 사진 촬영
   */
  const takePhoto = () => {
    console.log('📷 카메라로 사진 촬영 시작');

    launchCamera(imagePickerOptions, async (response: ImagePickerResponse) => {
      console.log('📷 카메라 촬영 응답:', response);

      if (response.didCancel) {
        console.log('📷 사용자가 카메라 촬영을 취소했습니다.');
        return;
      }

      if (response.errorMessage) {
        console.error('📷 카메라 촬영 에러:', response.errorMessage);
        Alert.alert('오류', '사진을 촬영할 수 없습니다.');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          console.log('✅ 카메라 촬영 완료:', asset.uri);
          // 이미지 촬영 후 서버에 업로드
          await uploadSelectedImages(asset.uri);
        }
      }
    });
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

  // 미리보기용 프로필 데이터 (API 데이터 기반)
  const profileData = userProfile ? {
    name: userProfile.nickname,
    age: userProfile.age,
    distance: `${userProfile.distanceBetweenMe}km`,
    category: userProfile.mainType,
    tags: userProfile.keywords,
    introduction: userProfile.introduction ? `"${userProfile.introduction}"` : '',
    images: userProfile.profileImageUrls
  } : {
    name: '',
    age: 0,
    distance: '0km',
    category: '',
    tags: [],
    introduction: '',
    images: []
  };

  // 기본 정보 표시용 데이터
  const basicInfo = userProfile ? `${userProfile.nickname} / ${userProfile.age} / ${userProfile.gender === 'male' ? '남' : '여'}` : '';
  const city = userProfile?.sido || '';
  const district = userProfile?.sigungu || '';

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <Layout showHeader={false}>
        <CustomHeader
          title="프로필 수정"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="text-body-large-regular text-text-primary mt-4">
            프로필 정보를 불러오는 중...
          </Text>
        </View>
      </Layout>
    );
  }

  // 업로드 중일 때 오버레이 표시
  if (isUploading) {
    return (
      <Layout showHeader={false}>
        <CustomHeader
          title="프로필 수정"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center bg-white opacity-50">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="text-body-large-regular text-text-primary mt-4">
            이미지를 업로드하는 중...
          </Text>
        </View>
      </Layout>
    );
  }

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
              <ProfileImageDisplay
                photos={photos}
                onPhotoUpload={handlePhotoUpload}
                onPhotoRemove={handlePhotoRemove}
              />
            </View>
            <Text>Photos length: {photos.length}</Text>
            <Text>PhotoIds length: {photoIds.length}</Text>
            <Text>User ID: {user?.id}</Text>
            <Text>UserProfile: {userProfile ? 'Loaded' : 'Not loaded'}</Text>
            <Text>Photos: {JSON.stringify(photos)}</Text>
            <Text>PhotoIds: {JSON.stringify(photoIds)}</Text>

            {/* API로 받아온 이미지 표시 */}
            {photos.length > 0 && (
              <View className="mb-8 px-4">
                <Text className="text-subheading-bold text-text-primary mb-4">API 이미지</Text>
                <Image 
                  source={{ uri: photos[0] }}
                  className="w-full h-64 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}

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

