import { MapPin } from "lucide-react";
import Navigation from "./Navigation";
import { useWebViewMessage } from "../hooks/useWebViewMessage";
import { useEffect, useRef, useState } from "react";

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap() {
  const KAKAO_MAP_JS_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY;
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // 카카오맵 초기화 함수 (좌표를 받은 후에만 실행)
  const initializeMap = (coords: {lat: number, lng: number}) => {
    if (!KAKAO_MAP_JS_KEY || !mapContainer.current || mapInitialized) return;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JS_KEY}`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps && mapContainer.current) {
        const mapOption = {
          center: new window.kakao.maps.LatLng(coords.lat, coords.lng), // RN에서 받은 좌표로 시작
          level: 3
        };

        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, mapOption);
        setMap(kakaoMap);

        // 마커 생성
        const initialMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(coords.lat, coords.lng)
        });
        initialMarker.setMap(kakaoMap);
        setMarker(initialMarker);

        setMapInitialized(true);
        console.log('카카오맵 초기화 완료 - 시작 좌표:', coords);
      }
    };
    
    document.head.appendChild(script);
  };

  // 지도 위치 업데이트 함수
  const updateMapLocation = (coords: {lat: number, lng: number}) => {
    if (!map || !window.kakao) {
      console.log('지도가 아직 준비되지 않음');
      return;
    }
    
    const position = new window.kakao.maps.LatLng(coords.lat, coords.lng);
    
    // 기존 마커 제거
    if (marker) {
      marker.setMap(null);
    }
    
    // 새 마커 생성
    const newMarker = new window.kakao.maps.Marker({
      position: position
    });
    
    newMarker.setMap(map);
    setMarker(newMarker);
    
    // 지도 중심 이동
    map.setCenter(position);
    
    console.log('지도 위치 업데이트 완료:', coords);
  };
  
  // 새로운 WebView 메시지 훅 사용
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('받은 메시지:', data);
    
    // 위도/경도 데이터 파싱
    try {
      let parsedData;
      if (typeof data === 'string') {
        parsedData = JSON.parse(data);
      } else {
        parsedData = data;
      }
      
      // React Native에서 보내는 데이터 구조에 맞춰 파싱
      let lat: number | undefined, lng: number | undefined;
      
      if (parsedData?.data?.latitude && parsedData?.data?.longtitude) {
        // RN에서 보내는 구조: { data: { latitude, longtitude } }
        lat = parseFloat(parsedData.data.latitude);
        lng = parseFloat(parsedData.data.longtitude);
      } else if (parsedData?.latitude && parsedData?.longitude) {
        // 직접 구조: { latitude, longitude }
        lat = parseFloat(parsedData.latitude);
        lng = parseFloat(parsedData.longitude);
      }
      
      if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
        const newCoordinates = { lat, lng };
        console.log('좌표 파싱 성공:', newCoordinates);
        setCoordinates(newCoordinates);
        
        if (!mapInitialized) {
          // 첫 번째 메시지: 해당 좌표로 지도 초기화
          console.log('첫 번째 좌표로 지도 초기화');
          initializeMap(newCoordinates);
        } else if (map && window.kakao) {
          // 이후 메시지: 지도 위치 업데이트
          console.log('기존 지도 위치 업데이트');
          updateMapLocation(newCoordinates);
        }
      }
    } catch (error) {
      console.error('메시지 파싱 오류:', error);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navigation /> */}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Map Container */}
        <div className="w-96 h-96 bg-white rounded-lg shadow-lg overflow-hidden">
          {KAKAO_MAP_JS_KEY && mapInitialized ? (
            <div
              ref={mapContainer}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto text-blue-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">카카오맵</h3>
                {!KAKAO_MAP_JS_KEY ? (
                  <p className="text-gray-500">API 키가 필요합니다</p>
                ) : !coordinates ? (
                  <p className="text-gray-500">위치 정보를 기다리는 중...</p>
                ) : (
                  <p className="text-gray-500">지도를 로딩 중...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 메시지 표시 영역 */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">받은 메시지:</h4>
          <div className="text-sm text-gray-600 break-words">
            {receivedMessage || "메시지를 기다리는 중..."}
          </div>
          {coordinates && (
            <div className="mt-2 text-xs text-blue-600">
              위도: {coordinates.lat}, 경도: {coordinates.lng}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KakaoMap;
