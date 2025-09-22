# 회원가입 API 시스템

React Native + Expo 환경에서 안전한 회원가입 및 인증 관리를 위한 시스템입니다.

## 📁 파일 구조

```
src/
├── api/
│   ├── client.js                    # API 클라이언트 (토큰 자동 첨부)
│   └── signup/
│       ├── signupApi.ts            # 회원가입 API 함수
│       ├── index.ts                # Export 모음
│       └── README.md               # 이 파일
├── hooks/
│   └── useSignup.ts                # 회원가입 훅
├── store/
│   └── authStore.ts                # 인증 상태 관리 (Zustand)
├── utils/
│   └── secureStorage.ts            # 안전한 토큰 저장 (expo-secure-store)
└── screens/signup/
    └── SignupScreen.tsx            # 회원가입 화면 (API 연동 완료)
```

## 🔐 보안 특징

### 1. 안전한 토큰 저장

- **expo-secure-store** 사용
- Android Keystore를 통한 OS 레벨 암호화
- Access Token, Refresh Token 안전 저장

### 2. 자동 토큰 관리

- API 요청 시 자동 Authorization 헤더 첨부
- 401 에러 감지 시 토큰 만료 처리
- 로그아웃 시 모든 토큰 자동 삭제

### 3. 전역 상태 관리

- **Zustand**를 사용한 간단하고 효율적인 상태 관리
- 앱 시작 시 저장된 인증 정보 자동 복원

## 🚀 사용 방법

### 1. 회원가입 화면에서 사용

```tsx
// SignupScreen.tsx에서 이미 구현됨
import {
  useSignup,
  transformFormDataToSignupRequest,
} from '../../hooks/useSignup';

const { signup, isLoading, error, isSuccess } = useSignup();

// 회원가입 실행
const signupData = transformFormDataToSignupRequest(formData);
await signup(signupData);
```

### 2. 인증 상태 확인

```tsx
import { useAuthStore } from '../store/authStore';

const { user, isAuthenticated, isLoading } = useAuthStore();

if (isAuthenticated) {
  // 로그인된 상태
  console.log('현재 사용자:', user);
}
```

### 3. 로그아웃

```tsx
import { useAuthStore } from '../store/authStore';

const { clearAuth } = useAuthStore();

const handleLogout = async () => {
  await clearAuth(); // 모든 토큰과 사용자 정보 삭제
};
```

## 📡 API 스펙

### 회원가입 요청

```typescript
POST / api / v1 / auth / signup;

interface SignupRequest {
  email: string; // 이메일
  nickname: string; // 닉네임 (이메일 @ 앞부분 자동 생성)
  password: string; // 비밀번호
  birthDate: string; // 생년월일
  gender: string; // 성별 ('male' | 'female')
  latitude: number; // 위도
  longitude: number; // 경도
  sido: string; // 시/도
  sigungu: string; // 시/군/구
  distance: number; // 거리 (반경)
}
```

### 회원가입 응답

```typescript
interface SignupResponse {
  status: 'SUCCESS';
  message: string;
  data: {
    accessToken?: string; // 자동 로그인용 (선택적)
    refreshToken?: string; // 자동 로그인용 (선택적)
    user?: object; // 사용자 정보 (선택적)
  };
}
```

## 🔍 디버깅 로그

모든 단계에서 상세한 콘솔 로그를 제공합니다:

### 회원가입 프로세스

```
🎣 useSignup 훅 초기화
👆 다음 버튼 클릭 - 현재 단계: radius
🚀 회원가입 API 호출 준비
🚀 현재 폼 데이터: {...}
🔄 폼 데이터를 API 요청 형식으로 변환
🚀 회원가입 프로세스 시작
🔍 클라이언트 사이드 유효성 검사 시작
✅ 클라이언트 사이드 유효성 검사 통과
📡 서버에 회원가입 요청 전송
```

### API 통신

```
📤 API 요청: {method: 'POST', url: '/auth/signup', ...}
📥 API 응답 성공: {status: 200, data: {...}}
🎉 회원가입 성공!
```

### 토큰 저장

```
🔐 회원가입 응답에 토큰 포함됨 - 자동 로그인 처리
🔐 Access Token 저장 시작
✅ Access Token 저장 성공
🔐 인증 정보 설정 시작
✅ 인증 정보 설정 완료
✅ 자동 로그인 완료
```

## ⚠️ 주의사항

1. **환경 변수 설정 필요**

   ```
   EXPO_PUBLIC_API_BASE_URL=https://j13a408.p.ssafy.io/dev/api/v1
   ```

2. **닉네임 자동 생성**
   - 현재는 이메일의 @ 앞부분을 닉네임으로 사용
   - 필요시 별도 입력 필드 추가 가능

3. **토큰 갱신**
   - 401 에러 감지는 구현됨
   - Refresh Token을 사용한 자동 갱신은 추후 구현 필요

## 🧪 테스트 방법

1. **회원가입 플로우 테스트**
   - SignupScreen에서 모든 단계 입력
   - 마지막 단계에서 "가입 완료" 버튼 클릭
   - 터미널에서 상세 로그 확인

2. **에러 처리 테스트**
   - 잘못된 이메일 형식 입력
   - 서버 연결 실패 시나리오
   - 유효성 검사 실패 시나리오

3. **토큰 저장 테스트**
   - 회원가입 성공 후 앱 재시작
   - 저장된 토큰 자동 복원 확인
   - 로그아웃 후 토큰 삭제 확인

## 📱 React Native 전용 기능

- **KeyboardAvoidingView**: 키보드 올라올 때 UI 자동 조정
- **Alert**: 네이티브 알림으로 에러 메시지 표시
- **expo-secure-store**: 안드로이드 Keystore 활용한 보안 저장
- **Zustand**: React Native에 최적화된 가벼운 상태 관리

---

이 시스템은 React Native + Expo + Android 환경에서 안전하고 효율적인 회원가입 및 인증 관리를 제공합니다.
