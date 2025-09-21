import { useEffect, useCallback, useRef } from 'react';
import { 
  type ReactNativeMessage, 
  type MessageHandler, 
  MESSAGE_TYPES,
  type NavigationMessage,
  type DataUpdateMessage,
  type UserActionMessage,
  type ErrorMessage,
  type SuccessMessage,
  type CustomMessage,
  type NavigationMessageHandler,
  type DataUpdateMessageHandler,
  type UserActionMessageHandler,
  type ErrorMessageHandler,
  type SuccessMessageHandler,
  type CustomMessageHandler
} from '../types/message';
import { messageHandler } from '../utils/messageHandler';

/**
 * React Native WebView 메시지를 처리하는 커스텀 훅
 */
export const useReactNativeMessage = () => {
  const handlersRef = useRef<Map<string, MessageHandler>>(new Map());

  /**
   * 메시지 핸들러 등록
   * @param messageType 메시지 타입
   * @param handler 메시지 핸들러 함수
   */
  const registerHandler = useCallback((messageType: string, handler: MessageHandler) => {
    messageHandler.registerHandler(messageType, handler);
    handlersRef.current.set(messageType, handler);
  }, []);

  /**
   * 메시지 핸들러 제거
   * @param messageType 메시지 타입
   */
  const unregisterHandler = useCallback((messageType: string) => {
    messageHandler.unregisterHandler(messageType);
    handlersRef.current.delete(messageType);
  }, []);

  /**
   * 네비게이션 메시지 핸들러 등록
   * @param handler 네비게이션 핸들러
   */
  const onNavigation = useCallback((handler: NavigationMessageHandler) => {
    registerHandler(MESSAGE_TYPES.NAVIGATION, handler as MessageHandler);
  }, [registerHandler]);

  /**
   * 데이터 업데이트 메시지 핸들러 등록
   * @param handler 데이터 업데이트 핸들러
   */
  const onDataUpdate = useCallback((handler: DataUpdateMessageHandler) => {
    registerHandler(MESSAGE_TYPES.DATA_UPDATE, handler as MessageHandler);
  }, [registerHandler]);

  /**
   * 사용자 액션 메시지 핸들러 등록
   * @param handler 사용자 액션 핸들러
   */
  const onUserAction = useCallback((handler: UserActionMessageHandler) => {
    registerHandler(MESSAGE_TYPES.USER_ACTION, handler as MessageHandler);
  }, [registerHandler]);

  /**
   * 에러 메시지 핸들러 등록
   * @param handler 에러 핸들러
   */
  const onError = useCallback((handler: ErrorMessageHandler) => {
    registerHandler(MESSAGE_TYPES.ERROR, handler as MessageHandler);
  }, [registerHandler]);

  /**
   * 성공 메시지 핸들러 등록
   * @param handler 성공 핸들러
   */
  const onSuccess = useCallback((handler: SuccessMessageHandler) => {
    registerHandler(MESSAGE_TYPES.SUCCESS, handler as MessageHandler);
  }, [registerHandler]);

  /**
   * 커스텀 메시지 핸들러 등록
   * @param handler 커스텀 핸들러
   */
  const onCustomMessage = useCallback((handler: CustomMessageHandler) => {
    registerHandler(MESSAGE_TYPES.CUSTOM, handler as MessageHandler);
  }, [registerHandler]);

  /**
   * React Native 앱으로 메시지 전송
   * @param message 전송할 메시지
   */
  const sendMessage = useCallback((message: ReactNativeMessage) => {
    messageHandler.sendMessageToNative(message);
  }, []);

  /**
   * 네비게이션 메시지 전송
   * @param route 이동할 라우트
   * @param params 라우트 파라미터
   */
  const navigateTo = useCallback((route: string, params?: Record<string, any>) => {
    messageHandler.navigateTo(route, params);
  }, []);

  /**
   * 데이터 업데이트 메시지 전송
   * @param key 데이터 키
   * @param value 데이터 값
   */
  const updateData = useCallback((key: string, value: any) => {
    messageHandler.updateData(key, value);
  }, []);

  /**
   * 사용자 액션 메시지 전송
   * @param action 액션 이름
   * @param payload 액션 데이터
   */
  const sendUserAction = useCallback((action: string, payload?: any) => {
    messageHandler.sendUserAction(action, payload);
  }, []);

  /**
   * 에러 메시지 전송
   * @param message 에러 메시지
   * @param code 에러 코드
   */
  const sendError = useCallback((message: string, code?: string) => {
    messageHandler.sendError(message, code);
  }, []);

  /**
   * 성공 메시지 전송
   * @param message 성공 메시지
   * @param result 결과 데이터
   */
  const sendSuccess = useCallback((message: string, result?: any) => {
    messageHandler.sendSuccess(message, result);
  }, []);

  /**
   * 커스텀 메시지 전송
   * @param type 메시지 타입
   * @param data 메시지 데이터
   */
  const sendCustomMessage = useCallback((type: string, data: any) => {
    messageHandler.sendCustomMessage(type, data);
  }, []);

  // 컴포넌트 언마운트 시 등록된 핸들러들 정리
  useEffect(() => {
    return () => {
      handlersRef.current.forEach((_, messageType) => {
        messageHandler.unregisterHandler(messageType);
      });
      handlersRef.current.clear();
    };
  }, []);

  return {
    // 핸들러 등록 함수들
    registerHandler,
    unregisterHandler,
    onNavigation,
    onDataUpdate,
    onUserAction,
    onError,
    onSuccess,
    onCustomMessage,
    
    // 메시지 전송 함수들
    sendMessage,
    navigateTo,
    updateData,
    sendUserAction,
    sendError,
    sendSuccess,
    sendCustomMessage,
    
    // 메시지 타입 상수
    MESSAGE_TYPES
  };
};
