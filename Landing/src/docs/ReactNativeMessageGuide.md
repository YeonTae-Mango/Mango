# React Native WebView 메시지 통신 가이드

이 가이드는 React Native WebView와 React 웹 애플리케이션 간의 메시지 통신을 위한 구현 방법을 설명합니다.

## 📁 파일 구조

```
src/
├── types/
│   └── message.ts              # 메시지 타입 정의
├── utils/
│   └── messageHandler.ts       # 메시지 핸들러 클래스
├── hooks/
│   └── useReactNativeMessage.ts # React Hook
├── components/
│   └── MessageExample.tsx      # 사용 예시 컴포넌트
└── App.tsx                     # 메인 앱 (메시지 핸들러 통합)
```

## 🚀 주요 기능

### 1. 메시지 타입
- **네비게이션**: 페이지 이동
- **데이터 업데이트**: 데이터 동기화
- **사용자 액션**: 사용자 인터랙션 처리
- **에러/성공**: 상태 메시지
- **커스텀**: 사용자 정의 메시지

### 2. 메시지 수신
React Native에서 WebView로 메시지를 전송하면 자동으로 수신됩니다.

### 3. 메시지 전송
웹 애플리케이션에서 React Native 앱으로 메시지를 전송할 수 있습니다.

## 💻 사용법

### 기본 사용법

```typescript
import { useReactNativeMessage } from './hooks/useReactNativeMessage';

function MyComponent() {
  const { 
    onNavigation, 
    onDataUpdate, 
    sendMessage, 
    navigateTo 
  } = useReactNativeMessage();

  useEffect(() => {
    // 네비게이션 메시지 수신
    onNavigation((message) => {
      console.log('네비게이션:', message.data.route);
    });

    // 데이터 업데이트 메시지 수신
    onDataUpdate((message) => {
      console.log('데이터 업데이트:', message.data);
    });
  }, [onNavigation, onDataUpdate]);

  // React Native로 메시지 전송
  const handleSendMessage = () => {
    navigateTo('/admin', { userId: 123 });
  };

  return (
    <button onClick={handleSendMessage}>
      메시지 전송
    </button>
  );
}
```

### 메시지 전송 함수들

```typescript
const {
  navigateTo,        // 네비게이션 메시지
  updateData,        // 데이터 업데이트 메시지
  sendUserAction,    // 사용자 액션 메시지
  sendError,         // 에러 메시지
  sendSuccess,       // 성공 메시지
  sendCustomMessage  // 커스텀 메시지
} = useReactNativeMessage();

// 사용 예시
navigateTo('/profile', { userId: 123 });
updateData('userSettings', { theme: 'dark' });
sendUserAction('buttonClick', { buttonId: 'submit' });
sendError('로그인 실패', 'LOGIN_ERROR');
sendSuccess('저장 완료', { id: 456 });
sendCustomMessage('myEvent', { data: 'custom data' });
```

### 메시지 수신 핸들러들

```typescript
const {
  onNavigation,      // 네비게이션 메시지 핸들러
  onDataUpdate,      // 데이터 업데이트 메시지 핸들러
  onUserAction,      // 사용자 액션 메시지 핸들러
  onError,           // 에러 메시지 핸들러
  onSuccess,         // 성공 메시지 핸들러
  onCustomMessage    // 커스텀 메시지 핸들러
} = useReactNativeMessage();

// 사용 예시
onNavigation((message) => {
  // message.data.route, message.data.params
});

onDataUpdate((message) => {
  // message.data.key, message.data.value
});

onUserAction((message) => {
  // message.data.action, message.data.payload
});
```

## 🔧 React Native 측 구현

React Native에서 WebView로 메시지를 전송하는 예시:

```javascript
// React Native 코드
import { WebView } from 'react-native-webview';

function MyWebView() {
  const webViewRef = useRef(null);

  const sendMessageToWebView = () => {
    const message = {
      type: 'navigation',
      data: {
        route: '/admin',
        params: { userId: 123 }
      },
      timestamp: Date.now()
    };
    
    webViewRef.current?.postMessage(JSON.stringify(message));
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://your-web-app.com' }}
      onMessage={(event) => {
        const message = JSON.parse(event.nativeEvent.data);
        console.log('WebView에서 받은 메시지:', message);
      }}
    />
  );
}
```

## 📝 메시지 형식

### 기본 메시지 구조
```typescript
interface ReactNativeMessage {
  type: string;        // 메시지 타입
  data?: any;          // 메시지 데이터
  timestamp?: number;  // 타임스탬프
}
```

### 네비게이션 메시지
```typescript
{
  type: 'navigation',
  data: {
    route: '/admin',
    params: { userId: 123 }
  },
  timestamp: 1640995200000
}
```

### 데이터 업데이트 메시지
```typescript
{
  type: 'data_update',
  data: {
    key: 'userSettings',
    value: { theme: 'dark', language: 'ko' }
  },
  timestamp: 1640995200000
}
```

## 🎯 예시 페이지

`/messageExample` 경로에서 실제 동작하는 예시를 확인할 수 있습니다.

## 🔍 디버깅

1. **브라우저 개발자 도구**: 콘솔에서 메시지 통신 로그 확인
2. **React Native 디버거**: React Native 측 메시지 로그 확인
3. **네트워크 탭**: WebView 통신 상태 확인

## ⚠️ 주의사항

1. **메시지 크기**: 큰 데이터는 JSON.stringify/parse 성능을 고려하세요
2. **에러 처리**: 메시지 파싱 실패에 대한 예외 처리가 필요합니다
3. **메모리 누수**: 컴포넌트 언마운트 시 핸들러 정리를 확인하세요
4. **보안**: 민감한 데이터는 암호화를 고려하세요

## 🚀 확장 가능성

- 메시지 큐 시스템 추가
- 메시지 암호화/복호화
- 메시지 전송 실패 시 재시도 로직
- 메시지 타입별 권한 관리
- 메시지 히스토리 저장
