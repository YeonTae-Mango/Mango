import apiClient from '../client.js';

// 사진 업로드 요청 타입 정의
export interface PhotoUploadRequest {
  files: string[]; // 이미지 URI 배열
}

// 사진 업로드 응답 타입 정의
export interface PhotoUploadResponse {
  status: string;
  message: string;
  data: {
    photoId: number;
    photoUrl: string;
  }[]; // 업로드된 이미지 정보 배열
}

// 에러 응답 타입 정의
export interface PhotoUploadErrorResponse {
  status: string;
  message: string;
}

/**
 * 사용자 사진 업로드 API 호출 함수
 * @param userId 사용자 ID
 * @param photoData 업로드할 사진 데이터
 * @returns Promise<PhotoUploadResponse>
 */
export const uploadUserPhotos = async (
  userId: number,
  photoData: PhotoUploadRequest
): Promise<PhotoUploadResponse> => {
  console.log('📸 사용자 사진 업로드 API 호출 시작');
  console.log('📸 사용자 ID:', userId);
  console.log('📸 업로드할 사진 개수:', photoData.files.length);

  try {
    console.log(
      '📸 API 요청 URL:',
      `${apiClient.defaults.baseURL}/photos/${userId}`
    );

    // 이미지 URI 확인
    console.log('📸 이미지 URI 분석:');
    photoData.files.forEach((imageUri, index) => {
      console.log(`📸 파일 ${index + 1}: ${imageUri}`);
    });

    console.log('📸 FormData로 이미지 전송 준비');

    // FormData를 사용하여 multipart/form-data로 전송
    console.log('📸 FormData로 multipart/form-data 전송 시작');

    const formData = new FormData();

    // 이미지 URI를 FormData에 직접 추가
    photoData.files.forEach((imageUri, index) => {
      // FormData에 파일 추가 (React Native 방식)
      formData.append('files', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `photo_${index + 1}.jpg`,
      } as any);
    });

    console.log('📸 FormData 준비 완료, 파일 개수:', photoData.files.length);

    // multipart/form-data로 API 호출
    const response = await apiClient.post<PhotoUploadResponse>(
      `/photos/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ 사진 업로드 API 호출 성공');
    console.log('✅ 응답 상태:', response.status);
    console.log('✅ 응답 데이터:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error('❌ 사진 업로드 API 호출 실패');

    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드
      console.error('❌ 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });

      // 400 에러 (파일 업로드 실패)
      if (error.response.status === 400) {
        console.error('❌ 400 Bad Request 에러 상세 분석:');
        console.error(
          '❌ 전체 응답 데이터:',
          JSON.stringify(error.response.data, null, 2)
        );
        console.error('❌ 응답 헤더:', error.response.headers);
        console.error('❌ 요청 URL:', error.config?.url);
        console.error(
          '❌ 요청 데이터 크기:',
          JSON.stringify(error.config?.data).length,
          'bytes'
        );

        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          '파일 업로드에 실패했습니다.';
        console.error('❌ 에러 메시지:', errorMessage);

        // 가능한 원인들 제시
        console.error('🔍 가능한 원인들:');
        console.error('1. API 엔드포인트가 존재하지 않음');
        console.error('2. 서버가 files 필드를 인식하지 못함');
        console.error('3. Base64 데이터 형식이 잘못됨');
        console.error('4. Content-Type이 잘못됨');
        console.error('5. 사용자 ID가 유효하지 않음');

        throw new Error(`서버 에러: ${errorMessage}`);
      }

      // 기타 서버 에러
      throw new Error(
        error.response.data?.message || '사진 업로드에 실패했습니다.'
      );
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못함
      console.error('❌ 네트워크 에러 - 응답 없음:', error.request);
      throw new Error(
        '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.'
      );
    } else {
      // 요청 설정 중 에러 발생
      console.error('❌ 요청 설정 에러:', error.message);
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 이미지 파일을 Base64로 변환하는 유틸리티 함수
 * @param imageUri 이미지 URI (react-native-image-picker에서 반환)
 * @returns Promise<string> Base64 인코딩된 문자열
 */
export const convertImageToBase64 = async (
  imageUri: string
): Promise<string> => {
  console.log('🔄 이미지를 Base64로 변환 시작:', imageUri);

  try {
    // React Native에서 fetch를 사용하여 이미지를 blob으로 읽기
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // "data:image/jpeg;base64," 부분 제거하고 순수 Base64만 반환
        const pureBase64 = base64String.split(',')[1];

        // Base64 데이터 크기 확인
        const sizeInKB = Math.round(pureBase64.length / 1024);
        console.log(
          `✅ Base64 변환 완료, 길이: ${pureBase64.length} 문자 (${sizeInKB}KB)`
        );

        // 너무 큰 경우 경고
        if (pureBase64.length > 200000) {
          // 200KB 이상
          console.warn(`⚠️ Base64 데이터가 큽니다: ${sizeInKB}KB`);
        }

        resolve(pureBase64);
      };
      reader.onerror = error => {
        console.error('❌ Base64 변환 실패:', error);
        reject(new Error('이미지 변환에 실패했습니다.'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('❌ 이미지 읽기 실패:', error);
    throw new Error('이미지를 읽을 수 없습니다.');
  }
};

/**
 * 여러 이미지를 Base64로 변환하는 유틸리티 함수
 * @param imageUris 이미지 URI 배열
 * @returns Promise<string[]> Base64 인코딩된 문자열 배열
 */
export const convertImagesToBase64 = async (
  imageUris: string[]
): Promise<string[]> => {
  console.log('🔄 여러 이미지를 Base64로 변환 시작, 개수:', imageUris.length);

  try {
    const base64Images = await Promise.all(
      imageUris.map(uri => convertImageToBase64(uri))
    );

    console.log('✅ 모든 이미지 Base64 변환 완료');
    return base64Images;
  } catch (error) {
    console.error('❌ 이미지 변환 중 오류 발생:', error);
    throw error;
  }
};

// 사진 삭제 응답 타입 정의
export interface PhotoDeleteResponse {
  message: string;
  data: {
    deletedPhotoId: number;
  };
  status: string;
}

/**
 * 사용자 사진 삭제 API 호출 함수
 * @param userId 사용자 ID
 * @param photoId 삭제할 사진 ID
 * @returns Promise<PhotoDeleteResponse>
 */
export const deleteUserPhoto = async (
  userId: number,
  photoId: number
): Promise<PhotoDeleteResponse> => {
  console.log('🗑️ 사용자 사진 삭제 API 호출 시작');
  console.log('🗑️ 사용자 ID:', userId);
  console.log('🗑️ 삭제할 사진 ID:', photoId);

  try {
    console.log(
      '🗑️ API 요청 URL:',
      `${apiClient.defaults.baseURL}/photos/${userId}/${photoId}`
    );

    const response = await apiClient.delete<PhotoDeleteResponse>(
      `/photos/${userId}/${photoId}`
    );

    console.log('✅ 사진 삭제 API 호출 성공');
    console.log('✅ 응답 상태:', response.status);
    console.log('✅ 응답 데이터:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error('❌ 사진 삭제 API 호출 실패');

    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드
      console.error('❌ 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });

      throw new Error(
        error.response.data?.message || '사진 삭제에 실패했습니다.'
      );
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못함
      console.error('❌ 네트워크 에러 - 응답 없음:', error.request);
      throw new Error(
        '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.'
      );
    } else {
      // 요청 설정 중 에러 발생
      console.error('❌ 요청 설정 에러:', error.message);
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 사진 업로드 데이터 유효성 검사
 * @param photoData 검증할 사진 업로드 데이터
 * @returns string[] 에러 메시지 배열
 */
export const validatePhotoUploadData = (
  photoData: PhotoUploadRequest
): string[] => {
  console.log('🔍 사진 업로드 데이터 유효성 검사 시작');
  console.log('🔍 검사할 사진 개수:', photoData.files.length);

  const errors: string[] = [];

  // 사진 개수 검증
  if (!photoData.files || photoData.files.length === 0) {
    errors.push('최소 1장의 사진을 업로드해주세요.');
  } else if (photoData.files.length > 4) {
    errors.push('최대 4장까지만 업로드할 수 있습니다.');
  }

  // Base64 형식 검증
  photoData.files.forEach((file, index) => {
    if (!file || typeof file !== 'string' || file.trim() === '') {
      errors.push(`${index + 1}번째 사진이 올바르지 않습니다.`);
    }
  });

  console.log(
    '🔍 유효성 검사 결과:',
    errors.length === 0 ? '✅ 통과' : `❌ ${errors.length}개 오류`
  );
  if (errors.length > 0) {
    console.log('🔍 오류 목록:', errors);
  }

  return errors;
};
