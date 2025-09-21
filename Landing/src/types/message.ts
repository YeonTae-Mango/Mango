// React Native WebView에서 전송되는 메시지 타입 정의

export interface ReactNativeMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

// 메시지 타입 상수
export const MESSAGE_TYPES = {
  NAVIGATION: 'navigation',
  DATA_UPDATE: 'data_update',
  USER_ACTION: 'user_action',
  ERROR: 'error',
  SUCCESS: 'success',
  CUSTOM: 'custom'
} as const;

// 네비게이션 메시지 타입
export interface NavigationMessage extends ReactNativeMessage {
  type: typeof MESSAGE_TYPES.NAVIGATION;
  data: {
    route: string;
    params?: Record<string, any>;
  };
}

// 데이터 업데이트 메시지 타입
export interface DataUpdateMessage extends ReactNativeMessage {
  type: typeof MESSAGE_TYPES.DATA_UPDATE;
  data: {
    key: string;
    value: any;
  };
}

// 사용자 액션 메시지 타입
export interface UserActionMessage extends ReactNativeMessage {
  type: typeof MESSAGE_TYPES.USER_ACTION;
  data: {
    action: string;
    payload?: any;
  };
}

// 에러 메시지 타입
export interface ErrorMessage extends ReactNativeMessage {
  type: typeof MESSAGE_TYPES.ERROR;
  data: {
    message: string;
    code?: string;
  };
}

// 성공 메시지 타입
export interface SuccessMessage extends ReactNativeMessage {
  type: typeof MESSAGE_TYPES.SUCCESS;
  data: {
    message: string;
    result?: any;
  };
}

// 커스텀 메시지 타입
export interface CustomMessage extends ReactNativeMessage {
  type: typeof MESSAGE_TYPES.CUSTOM;
  data: any;
}

// 메시지 핸들러 타입
export type MessageHandler = (message: ReactNativeMessage) => void;

// 특정 메시지 타입의 핸들러 타입들
export type NavigationMessageHandler = (message: NavigationMessage) => void;
export type DataUpdateMessageHandler = (message: DataUpdateMessage) => void;
export type UserActionMessageHandler = (message: UserActionMessage) => void;
export type ErrorMessageHandler = (message: ErrorMessage) => void;
export type SuccessMessageHandler = (message: SuccessMessage) => void;
export type CustomMessageHandler = (message: CustomMessage) => void;

// 메시지 핸들러 맵 타입
export type MessageHandlerMap = {
  [K in typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES]]?: MessageHandler;
};
