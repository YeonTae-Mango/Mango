import { 
  type ReactNativeMessage, 
  type MessageHandler, 
  type MessageHandlerMap, 
  MESSAGE_TYPES,
  type NavigationMessage,
  type DataUpdateMessage,
  type UserActionMessage,
  type ErrorMessage,
  type SuccessMessage,
  type CustomMessage
} from '../types/message';

/**
 * React Native WebView에서 전송되는 메시지를 처리하는 클래스
 */
export class ReactNativeMessageHandler {
  private handlers: MessageHandlerMap = {};
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * 메시지 리스너 초기화
   */
  private initialize(): void {
    if (this.isInitialized) return;

    // window.addEventListener를 사용하여 React Native WebView 메시지 수신
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // React Native WebView의 postMessage 이벤트도 처리 (타입 캐스팅 필요)
    document.addEventListener('message', this.handleMessage.bind(this) as EventListener);
    
    this.isInitialized = true;
    console.log('React Native 메시지 핸들러가 초기화되었습니다.');
  }

  /**
   * 메시지 핸들러 등록
   * @param messageType 메시지 타입
   * @param handler 메시지 핸들러 함수
   */
  public registerHandler(messageType: string, handler: MessageHandler): void {
    this.handlers[messageType as keyof MessageHandlerMap] = handler;
    console.log(`메시지 핸들러가 등록되었습니다: ${messageType}`);
  }

  /**
   * 메시지 핸들러 제거
   * @param messageType 메시지 타입
   */
  public unregisterHandler(messageType: string): void {
    delete this.handlers[messageType as keyof MessageHandlerMap];
    console.log(`메시지 핸들러가 제거되었습니다: ${messageType}`);
  }

  /**
   * 모든 메시지 핸들러 제거
   */
  public clearHandlers(): void {
    this.handlers = {};
    console.log('모든 메시지 핸들러가 제거되었습니다.');
  }

  /**
   * 메시지 처리 메인 함수
   * @param event 메시지 이벤트
   */
  private handleMessage(event: MessageEvent): void {
    try {
      // React Native WebView에서 전송된 메시지 파싱
      let message: ReactNativeMessage;
      
      if (typeof event.data === 'string') {
        message = JSON.parse(event.data);
      } else if (typeof event.data === 'object') {
        message = event.data;
      } else {
        console.warn('알 수 없는 메시지 형식:', event.data);
        return;
      }

      // 메시지 유효성 검사
      if (!this.isValidMessage(message)) {
        console.warn('유효하지 않은 메시지:', message);
        return;
      }

      console.log('메시지 수신:', message);

      // 해당 타입의 핸들러 실행
      const handler = this.handlers[message.type as keyof MessageHandlerMap];
      if (handler) {
        handler(message);
      } else {
        console.warn(`등록되지 않은 메시지 타입: ${message.type}`);
      }

    } catch (error) {
      console.error('메시지 처리 중 오류 발생:', error);
    }
  }

  /**
   * 메시지 유효성 검사
   * @param message 검사할 메시지
   * @returns 유효한 메시지인지 여부
   */
  private isValidMessage(message: any): message is ReactNativeMessage {
    return (
      message &&
      typeof message === 'object' &&
      typeof message.type === 'string' &&
      message.type.length > 0
    );
  }

  /**
   * React Native 앱으로 메시지 전송
   * @param message 전송할 메시지
   */
  public sendMessageToNative(message: ReactNativeMessage): void {
    try {
      // React Native WebView의 window.ReactNativeWebView.postMessage 사용
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
        console.log('React Native로 메시지 전송:', message);
      } else {
        console.warn('React Native WebView가 감지되지 않았습니다.');
      }
    } catch (error) {
      console.error('React Native로 메시지 전송 중 오류 발생:', error);
    }
  }

  /**
   * 네비게이션 메시지 전송 헬퍼
   * @param route 이동할 라우트
   * @param params 라우트 파라미터
   */
  public navigateTo(route: string, params?: Record<string, any>): void {
    const message: NavigationMessage = {
      type: MESSAGE_TYPES.NAVIGATION,
      data: { route, params },
      timestamp: Date.now()
    };
    this.sendMessageToNative(message);
  }

  /**
   * 데이터 업데이트 메시지 전송 헬퍼
   * @param key 데이터 키
   * @param value 데이터 값
   */
  public updateData(key: string, value: any): void {
    const message: DataUpdateMessage = {
      type: MESSAGE_TYPES.DATA_UPDATE,
      data: { key, value },
      timestamp: Date.now()
    };
    this.sendMessageToNative(message);
  }

  /**
   * 사용자 액션 메시지 전송 헬퍼
   * @param action 액션 이름
   * @param payload 액션 데이터
   */
  public sendUserAction(action: string, payload?: any): void {
    const message: UserActionMessage = {
      type: MESSAGE_TYPES.USER_ACTION,
      data: { action, payload },
      timestamp: Date.now()
    };
    this.sendMessageToNative(message);
  }

  /**
   * 에러 메시지 전송 헬퍼
   * @param message 에러 메시지
   * @param code 에러 코드
   */
  public sendError(message: string, code?: string): void {
    const errorMessage: ErrorMessage = {
      type: MESSAGE_TYPES.ERROR,
      data: { message, code },
      timestamp: Date.now()
    };
    this.sendMessageToNative(errorMessage);
  }

  /**
   * 성공 메시지 전송 헬퍼
   * @param message 성공 메시지
   * @param result 결과 데이터
   */
  public sendSuccess(message: string, result?: any): void {
    const successMessage: SuccessMessage = {
      type: MESSAGE_TYPES.SUCCESS,
      data: { message, result },
      timestamp: Date.now()
    };
    this.sendMessageToNative(successMessage);
  }

  /**
   * 커스텀 메시지 전송 헬퍼
   * @param type 메시지 타입
   * @param data 메시지 데이터
   */
  public sendCustomMessage(type: string, data: any): void {
    const message: CustomMessage = {
      type: MESSAGE_TYPES.CUSTOM,
      data: { type, data },
      timestamp: Date.now()
    };
    this.sendMessageToNative(message);
  }

  /**
   * 메시지 핸들러 정리
   */
  public destroy(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
    document.removeEventListener('message', this.handleMessage.bind(this) as EventListener);
    this.clearHandlers();
    this.isInitialized = false;
    console.log('React Native 메시지 핸들러가 정리되었습니다.');
  }
}

// 전역 인스턴스 생성
export const messageHandler = new ReactNativeMessageHandler();

// React Native WebView 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
