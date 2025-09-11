# EAS (Expo Application Services) 빌드 가이드

React Native + Expo 프로젝트를 EAS를 사용해 Android APK로 빌드하는 방법을 안내합니다.

## 📋 사전 준비

- Node.js 16.18.1 이상 설치
- React Native + Expo 프로젝트
- Expo 계정 (무료)

## 🚀 1단계: EAS CLI 설치

```bash
npm install -g eas-cli
```

## 🔐 2단계: EAS 로그인

```bash
eas login
```

Expo 계정 정보를 입력하여 로그인합니다.

## ⚙️ 3단계: EAS 빌드 설정

프로젝트 루트 디렉토리에서 실행:

```bash
eas build:configure
```

이 명령어는 `eas.json` 파일을 생성합니다.

## 📝 4단계: eas.json 설정

생성된 `eas.json` 파일을 APK 빌드용으로 수정:

```json
{
  "cli": {
    "version": ">= 16.18.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 🔧 5단계: 프로젝트 설정 확인

빌드 전 프로젝트 상태 확인:

```bash
npx expo doctor
```

오류가 있다면 해결 후 진행합니다.

## 📱 6단계: Android APK 빌드

### Preview 빌드 (테스트용)

- 저는 preview 방식으로 진행했었습니다!(정연)

```bash
eas build --platform android --profile preview
```

### Production 빌드 (배포용)

```bash
eas build --platform android --profile production
```

## 📊 7단계: 빌드 상태 확인

```bash
eas build:list
```

또는 [Expo 대시보드](https://expo.dev)에서 확인 가능합니다.

## 📥 8단계: APK 다운로드

빌드 완료 후:

1. 터미널에 표시된 링크 클릭
2. 또는 Expo 대시보드에서 다운로드
3. APK 파일을 모바일 기기로 전송하여 설치

## ⚠️ 주의사항

- 첫 빌드는 10-20분 소요될 수 있음
- Android 기기에서 "알 수 없는 소스" 설치 허용 필요
- 빌드 큐가 있을 경우 대기 시간 발생 가능

## 🔍 문제 해결

### EAS CLI 설치 오류

```bash
# 캐시 정리 후 재시도
npm cache clean --force
npm install -g eas-cli
```

### 패키지 호환성 오류

```bash
npx expo install --check
```

### .expo 디렉토리 Git 오류

`.gitignore`에 다음 추가:

```
.expo/
```

## 📚 추가 자료

- [EAS Build 공식 문서](https://docs.expo.dev/build/introduction/)
- [Expo 대시보드](https://expo.dev)
- [EAS CLI 명령어 레퍼런스](https://docs.expo.dev/build-reference/eas-cli/)

---
