import { useState, useEffect } from 'react';

/**
 * React Native WebView에서 메시지를 받는 커스텀 훅
 * @param onMessage - 메시지를 받았을 때 실행할 콜백 함수
 * @returns 받은 메시지와 메시지 설정 함수
 */
export const useWebViewMessage = (onMessage?: (data: any) => void) => {
  const [receivedMessage, setReceivedMessage] = useState<string>('');

  useEffect(() => {
    console.log('useWebViewMessage 훅이 초기화되었습니다.');
    
    const handleMessage = (event: any) => {
      console.log('메시지 이벤트 발생:', event);
      try {
        const rawData = event.data;
        console.log('React Native에서 받은 원시 메시지:', rawData);
        
        let parsedData;
        // JSON 문자열인지 확인하고 파싱
        if (typeof rawData === 'string') {
          try {
            parsedData = JSON.parse(rawData);
            console.log('JSON 파싱된 메시지:', parsedData);
          } catch (parseError) {
            console.log('JSON 파싱 실패, 원시 문자열 사용:', rawData);
            parsedData = rawData;
          }
        } else {
          parsedData = rawData;
        }
        
        // 메시지 상태 업데이트 (원시 데이터로)
        setReceivedMessage(rawData);
        
        // 콜백 함수에는 파싱된 데이터 전달
        if (onMessage) {
          onMessage(parsedData);
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error);
        setReceivedMessage('메시지 처리 오류');
      }
    };

    // React Native WebView는 document.addEventListener 사용
    document.addEventListener('message', handleMessage);
    // 혹시 window도 시도
    window.addEventListener('message', handleMessage);
    
    console.log('메시지 리스너가 등록되었습니다.');
    
    return () => {
      document.removeEventListener('message', handleMessage);
      window.removeEventListener('message', handleMessage);
      console.log('메시지 리스너가 제거되었습니다.');
    };
  }, [onMessage]);

  return {
    receivedMessage,
    setReceivedMessage
  };
};