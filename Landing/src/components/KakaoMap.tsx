import { MapPin } from "lucide-react";
import Navigation from "./Navigation";
import { useParams } from "react-router-dom";
import { useReactNativeMessage } from "../hooks/useReactNativeMessage";
import { useState, useEffect } from "react";
import type { CustomMessage } from "../types/message";

function KakaoMap() {
  const KAKAO_MAP_JS_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY;
  const {longitude, latitude} = useParams();
  const [receivedMessage, setReceivedMessage] = useState<string>("");
  
  // React Native 메시지 훅 사용
  const { onCustomMessage, registerHandler } = useReactNativeMessage();

  useEffect(() => {
    // 커스텀 메시지 핸들러 등록
    onCustomMessage((message: CustomMessage) => {
      console.log('Received message:', message);
      if (message.data && typeof message.data === 'string') {
        setReceivedMessage(message.data);
      } else if (message.data && message.data.message) {
        setReceivedMessage(message.data.message);
      } else {
        setReceivedMessage(JSON.stringify(message.data));
      }
    });

    // 모든 타입의 메시지를 받기 위한 일반 핸들러도 등록
    registerHandler('message', (message: any) => {
      console.log('Received general message:', message);
      if (message.data && typeof message.data === 'string') {
        setReceivedMessage(message.data);
      } else if (message.data && message.data.message) {
        setReceivedMessage(message.data.message);
      } else {
        setReceivedMessage(JSON.stringify(message.data || message));
      }
    });
  }, [onCustomMessage, registerHandler]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Map */}
      <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto text-blue-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">카카오맵</h3>
          <p className="text-gray-500">지도 기능이 곧 추가됩니다</p>
          {KAKAO_MAP_JS_KEY ? (
            <p className="text-sm text-green-600 mt-2">API 키 설정됨</p>
          ) : (
            <p className="text-sm text-red-600 mt-2">API 키 필요</p>
          )}
          <span className="block mt-4 p-2 bg-white rounded-md border border-gray-200 min-h-[40px] text-sm text-gray-700">
            {receivedMessage || "메시지를 기다리는 중..."}
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}

export default KakaoMap;
