import { useState, useCallback, useMemo } from 'react';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
  ImagePickerOptions,
} from 'react-native-image-picker';
import { Alert } from 'react-native';
import {
  uploadUserPhotos,
  convertImagesToBase64,
  validatePhotoUploadData,
  PhotoUploadRequest,
} from '../api/photos/photoApi';
import { useAuthStore } from '../store/authStore';

// 선택된 이미지 정보 타입
export interface SelectedImage {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
}

// 사진 업로드 훅의 상태 타입
interface UsePhotoUploadState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  selectedImages: SelectedImage[];
}

// 사진 업로드 훅의 반환 타입
interface UsePhotoUploadReturn extends UsePhotoUploadState {
  selectFromLibrary: () => void;
  takePhoto: () => void;
  removeImage: (index: number) => void;
  uploadPhotos: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * 사진 업로드 커스텀 훅
 * @returns UsePhotoUploadReturn
 */
export const usePhotoUpload = (): UsePhotoUploadReturn => {
  const [state, setState] = useState<UsePhotoUploadState>({
    isLoading: false,
    error: null,
    isSuccess: false,
    selectedImages: [],
  });

  const { user } = useAuthStore();

  // 초기화 로그는 한 번만 출력하도록 useMemo 사용
  useMemo(() => {
    console.log('📸 usePhotoUpload 훅 초기화');
    return true;
  }, []);

  // 이미지 피커 옵션 설정 (더 작은 크기로 압축)
  const imagePickerOptions: ImagePickerOptions = {
    mediaType: 'photo' as MediaType,
    quality: 0.5, // 품질을 0.8에서 0.5로 낮춤
    maxWidth: 800, // 1024에서 800으로 줄임
    maxHeight: 800, // 1024에서 800으로 줄임
    includeBase64: false, // URI만 사용하고 나중에 Base64로 변환
  };

  /**
   * 갤러리에서 사진 선택
   */
  const selectFromLibrary = useCallback(() => {
    console.log('📱 갤러리에서 사진 선택 시작');

    // 최대 4장 제한 확인
    if (state.selectedImages.length >= 4) {
      Alert.alert('알림', '최대 4장까지만 선택할 수 있습니다.');
      return;
    }

    launchImageLibrary(imagePickerOptions, (response: ImagePickerResponse) => {
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
          const newImage: SelectedImage = {
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
            fileSize: asset.fileSize,
          };

          console.log('✅ 갤러리에서 사진 선택 완료:', newImage);

          setState(prev => ({
            ...prev,
            selectedImages: [...prev.selectedImages, newImage],
            error: null,
          }));
        }
      }
    });
  }, [state.selectedImages.length, imagePickerOptions]);

  /**
   * 카메라로 사진 촬영
   */
  const takePhoto = useCallback(() => {
    console.log('📷 카메라로 사진 촬영 시작');

    // 최대 4장 제한 확인
    if (state.selectedImages.length >= 4) {
      Alert.alert('알림', '최대 4장까지만 선택할 수 있습니다.');
      return;
    }

    launchCamera(imagePickerOptions, (response: ImagePickerResponse) => {
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
          const newImage: SelectedImage = {
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
            fileSize: asset.fileSize,
          };

          console.log('✅ 카메라 촬영 완료:', newImage);

          setState(prev => ({
            ...prev,
            selectedImages: [...prev.selectedImages, newImage],
            error: null,
          }));
        }
      }
    });
  }, [state.selectedImages.length, imagePickerOptions]);

  /**
   * 선택된 이미지 제거
   * @param index 제거할 이미지의 인덱스
   */
  const removeImage = useCallback((index: number) => {
    console.log('🗑️ 이미지 제거:', index);

    setState(prev => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((_, i) => i !== index),
      error: null,
    }));
  }, []);

  /**
   * 선택된 사진들을 서버에 업로드
   */
  const uploadPhotos = useCallback(async (): Promise<void> => {
    console.log('🚀 사진 업로드 프로세스 시작');
    console.log('🚀 선택된 이미지 개수:', state.selectedImages.length);

    // 실제 사용자 ID 사용
    const userId = user?.id;

    console.log('👤 사용자 정보 확인:');
    console.log('👤 전체 사용자 객체:', JSON.stringify(user, null, 2));
    console.log('👤 사용자 ID:', userId);

    // 사용자 ID가 없으면 임시 ID 사용
    const finalUserId = userId || 1;

    if (!userId) {
      console.error('❌ 사용자 정보가 없습니다.');
      console.error('❌ 사용자 객체:', JSON.stringify(user, null, 2));
      console.error('❌ 사용자 ID가 없어서 임시 ID(1) 사용');
    }

    console.log('👤 최종 사용자 ID:', finalUserId);

    // 로딩 상태 시작
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false,
    }));

    try {
      // 1. 클라이언트 사이드 유효성 검사
      console.log('🔍 클라이언트 사이드 유효성 검사 시작');

      if (state.selectedImages.length === 0) {
        throw new Error('최소 1장의 사진을 선택해주세요.');
      }

      if (state.selectedImages.length > 4) {
        throw new Error('최대 4장까지만 업로드할 수 있습니다.');
      }

      console.log('✅ 클라이언트 사이드 유효성 검사 통과');

      // 2. 이미지 URI를 직접 사용 (Base64 변환 없이)
      console.log('🔄 이미지 URI 직접 사용');
      const imageUris = state.selectedImages.map(img => img.uri);

      // 3. API 요청 데이터 준비 (URI 직접 사용)
      const photoData: PhotoUploadRequest = {
        files: imageUris, // Base64 대신 URI 직접 사용
      };

      // 4. 서버 사이드 유효성 검사
      console.log('🔍 서버 사이드 유효성 검사 시작');
      const validationErrors = validatePhotoUploadData(photoData);

      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join('\n');
        console.error('❌ 유효성 검사 실패:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ 서버 사이드 유효성 검사 통과');

      // 5. API 호출
      console.log('📡 서버에 사진 업로드 요청 전송');
      console.log('📡 사용할 사용자 ID:', finalUserId);
      const response = await uploadUserPhotos(finalUserId, photoData);

      console.log('🎉 사진 업로드 성공!');
      console.log('🎉 서버 응답:', JSON.stringify(response, null, 2));

      // 성공 상태 업데이트
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        isSuccess: true,
      }));
    } catch (error: any) {
      console.error('💥 사진 업로드 실패:', error);

      const errorMessage =
        error.message || '사진 업로드 중 오류가 발생했습니다.';
      console.error('💥 에러 메시지:', errorMessage);

      // 에러 상태 업데이트
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isSuccess: false,
      }));
    }
  }, [state.selectedImages, user]);

  /**
   * 에러 상태 초기화
   */
  const clearError = useCallback((): void => {
    console.log('🧹 에러 상태 초기화');
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * 전체 상태 초기화
   */
  const reset = useCallback((): void => {
    console.log('🔄 사진 업로드 상태 전체 초기화');
    setState({
      isLoading: false,
      error: null,
      isSuccess: false,
      selectedImages: [],
    });
  }, []);

  return useMemo(
    () => ({
      ...state,
      selectFromLibrary,
      takePhoto,
      removeImage,
      uploadPhotos,
      clearError,
      reset,
    }),
    [
      state,
      selectFromLibrary,
      takePhoto,
      removeImage,
      uploadPhotos,
      clearError,
      reset,
    ]
  );
};
