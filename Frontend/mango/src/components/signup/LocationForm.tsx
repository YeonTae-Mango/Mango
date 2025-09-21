import { NaverMapMarkerOverlay, NaverMapView } from '@mj-studio/react-native-naver-map';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';

interface LocationFormProps {
  city: string;
  district: string;
  onLocationChange: (city: string, district: string, latitude: number, longitude: number) => void;
  onCityPress: () => void;
  onDistrictPress: () => void;
}

const DEFAULT_CAMERA = { latitude: 37.5013, longitude: 127.0396, zoom: 15 };

export default function LocationForm({ 
  city, 
  district, 
  onLocationChange,
  onCityPress, 
  onDistrictPress 
}: LocationFormProps) {
  const [camera, setCamera] = useState(DEFAULT_CAMERA);
  const [isLoading, setIsLoading] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(DEFAULT_CAMERA);
  const [currentSido, setCurrentSido] = useState<string>('');
  const [currentSigungu, setCurrentSigungu] = useState<string>('');
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한', '위치 권한이 필요합니다.');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;

      const newPosition = { latitude, longitude, zoom: 15 };
      setCamera(newPosition);
      setMarkerPosition(newPosition);

      // 현재 위치에 대해 역지오코딩 1회
      reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      Alert.alert('오류', '현재 위치를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraChanged = (params: any) => {
    const { latitude, longitude, zoom } = params;
    setMarkerPosition({ latitude, longitude, zoom });
  };

  const handleCameraIdle = () => {
    // 과도한 호출 방지를 위해 300ms 디바운스
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      reverseGeocode(markerPosition.latitude, markerPosition.longitude);
    }, 300);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const { NCP_MAPS_CLIENT_ID, NCP_MAPS_CLIENT_KEY } = Constants.expoConfig?.extra ?? {};
      
      if (!NCP_MAPS_CLIENT_ID || !NCP_MAPS_CLIENT_KEY) {
        console.warn('Naver Cloud API 키가 설정되지 않았습니다.');
        return;
      }

      const query = new URLSearchParams({
        coords: `${lng},${lat}`,
        orders: 'admcode',
        output: 'json'
      }).toString();

      const url = `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?${query}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-ncp-apigw-api-key-id': NCP_MAPS_CLIENT_ID,
          'x-ncp-apigw-api-key': NCP_MAPS_CLIENT_KEY,
          'Accept-Language': 'ko'
        }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Reverse geocode 실패:', res.status, text);
        return;
      }

      const data = await res.json();
      const first = data?.results?.[0];
      const area1 = first?.region?.area1?.name ?? '';
      const area2 = first?.region?.area2?.name ?? '';

      setCurrentSido(area1);
      setCurrentSigungu(area2);
      
      // 부모 컴포넌트에 위치 정보 전달
      onLocationChange(area1, area2, lat, lng);
    } catch (e) {
      console.error('reverseGeocode error:', e);
    }
  };
  return (
    <View className="flex-1 pt-10">
      {/* 안내 문구 */}
      <View className="mb-4">
        <Text className="text-heading-bold text-text-primary text-center">
          이 위치가 맞나요?
        </Text>
      </View>

      {/* 지도 영역 */}
      <View className="flex-1 mb-6 px-4">
        {!isLoading ? (
          <View className="w-full h-full rounded-xl overflow-hidden">
            <NaverMapView
              style={{ width: '100%', height: '100%' }}
              initialCamera={camera}
              onCameraChanged={handleCameraChanged}
              onCameraIdle={handleCameraIdle}
            >
              <NaverMapMarkerOverlay
                latitude={markerPosition.latitude}
                longitude={markerPosition.longitude}
                image={{ symbol: 'red' }}
                onTap={() => console.log('Marker tapped')}
              />
            </NaverMapView>
          </View>
        ) : (
          <View className="flex-1 bg-gray rounded-xl justify-center items-center">
            <Text className="text-xl text-secondary font-semibold">위치를 불러오는 중...</Text>
          </View>
        )}
      </View>

      {/* 시/군/구 선택 버튼들 */}
      <View className="flex-row gap-4 mb-6 px-4">
        {/* 시/도 버튼 */}
        <TouchableOpacity
          className="flex-1 h-14 bg-gray rounded-xl justify-center items-center"
          onPress={onCityPress}
        >
          <Text className={`text-base font-semibold ${
            currentSido || city ? 'text-text-primary' : 'text-secondary'
          }`}>
            {currentSido || city || '시/도'}
          </Text>
        </TouchableOpacity>

        {/* 구/군 버튼 */}
        <TouchableOpacity
          className="flex-1 h-14 bg-gray rounded-xl justify-center items-center"
          onPress={onDistrictPress}
        >
          <Text className={`text-base font-semibold ${
            currentSigungu || district ? 'text-text-primary' : 'text-secondary'
          }`}>
            {currentSigungu || district || '구/군'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
