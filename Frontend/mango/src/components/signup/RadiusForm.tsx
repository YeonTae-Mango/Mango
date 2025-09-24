import {
  NaverMapCircleOverlay,
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

interface RadiusFormProps {
  latitude: number;
  longitude: number;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export default function RadiusForm({
  latitude,
  longitude,
  radius,
  onRadiusChange,
}: RadiusFormProps) {
  const [currentRadius, setCurrentRadius] = useState(radius);
  // 거리 옵션들 (ProfileEditScreen과 동일한 7개 스텝, m 단위로 변환)
  const distanceOptions = [1000, 3000, 5000, 10000, 30000, 50000, 100000]; // 1km, 3km, 5km, 10km, 30km, 50km, 100km
  const distanceIndex = distanceOptions.findIndex(
    option => option >= currentRadius
  );
  const currentDistance = distanceOptions[Math.max(0, distanceIndex)];

  // 각 거리별 소요 시간 (분) - ProfileEditScreen과 동일
  const timeRanges = [
    { min: 2, max: 3 }, // 1km
    { min: 6, max: 10 }, // 3km
    { min: 15, max: 25 }, // 5km
    { min: 25, max: 35 }, // 10km
    { min: 45, max: 60 }, // 30km
    { min: 60, max: 75 }, // 50km
    { min: 75, max: 90 }, // 100km
  ];

  // 반경에 따른 줌 레벨 계산 함수
  const calculateZoom = (radius: number) => {
    if (radius <= 1000) return 13; // 1km 이하: 매우 가까운 거리
    if (radius <= 3000) return 11; // 1-3km: 가까운 거리
    if (radius <= 5000) return 10; // 3-5km: 보통 거리
    if (radius <= 10000) return 9; // 5-10km: 먼 거리
    if (radius <= 30000) return 8; // 10-30km: 매우 먼 거리
    if (radius <= 50000) return 7; // 30-50km: 광역 거리
    return 6; // 50km 이상: 초광역 거리
  };

  // 반경에 따른 안내 문구 생성
  const getRadiusDescription = (radius: number) => {
    if (radius <= 1000) return '매우 가까운 거리 (건물 단위)';
    if (radius <= 3000) return '가까운 거리 (블록 단위)';
    if (radius <= 5000) return '보통 거리 (동네 단위)';
    if (radius <= 10000) return '먼 거리 (지역 단위)';
    if (radius <= 30000) return '매우 먼 거리 (광역 단위)';
    if (radius <= 50000) return '초광역 거리 (시/도 단위)';
    return '전국 단위 거리';
  };

  const [camera, setCamera] = useState({
    latitude,
    longitude,
    zoom: calculateZoom(currentRadius),
  });

  // props가 변경될 때 카메라 위치 업데이트
  useEffect(() => {
    setCamera({
      latitude,
      longitude,
      zoom: calculateZoom(currentRadius),
    });
  }, [latitude, longitude, currentRadius]);

  const handleRadiusChange = (value: number) => {
    setCurrentRadius(value);
    onRadiusChange(value);
  };

  return (
    <View className="flex-1 pt-10">
      {/* 안내 문구 */}
      <View className="mb-4">
        <Text className="text-heading-bold text-text-primary text-center">
          활동 반경을 설정해주세요
        </Text>
      </View>

      {/* 지도 영역 */}
      <View className="flex-1 mb-6 px-4">
        <View className="w-full h-full rounded-xl overflow-hidden">
          <NaverMapView
            style={{ width: '100%', height: '100%' }}
            camera={camera}
            isScrollGesturesEnabled={false}
            isZoomGesturesEnabled={false}
            isTiltGesturesEnabled={false}
            isRotateGesturesEnabled={false}
            isStopGesturesEnabled={false}
          >
            <NaverMapMarkerOverlay
              latitude={latitude}
              longitude={longitude}
              image={{ symbol: 'red' }}
              onTap={() => console.log('Marker tapped')}
            />
            <NaverMapCircleOverlay
              latitude={latitude}
              longitude={longitude}
              radius={currentRadius}
              color={'#FF6D6033'}
              outlineColor={'#FF6D60'}
              outlineWidth={2}
              onTap={() => console.log('Circle tapped')}
            />
          </NaverMapView>
        </View>
      </View>

      {/* 슬라이더 영역 */}
      <View className="px-4 mb-6">
        <Text className="text-subheading-bold text-text-primary mb-6">
          희망하는 반경
        </Text>

        {/* 슬라이더 영역 */}
        <View className="mb-4">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={6}
            value={distanceIndex}
            onValueChange={value => {
              const newIndex = Math.round(value);
              const newRadius = distanceOptions[newIndex];
              handleRadiusChange(newRadius);
            }}
            step={1}
            minimumTrackTintColor="#FF6D60"
            maximumTrackTintColor="#E5E5E5"
            thumbTintColor="#FF6D60"
          />
        </View>

        {/* 반경 표시 */}
        <View className="flex-row items-center justify-center gap-3">
          <View className="bg-mango-primary rounded-full px-4 py-1.5 flex-row items-center">
            <Ionicons name="location-outline" size={14} color="white" />
            <Text className="text-body-medium-semibold text-white ml-2">
              {Math.round(currentRadius / 1000)}km
            </Text>
          </View>
          <Text className="text-body-large-regular text-text-primary">
            자동차로{' '}
            <Text className="font-bold">
              {timeRanges[distanceIndex]?.min || 0}~
              {timeRanges[distanceIndex]?.max || 0}분
            </Text>{' '}
            정도 걸려요!
          </Text>
        </View>
      </View>
    </View>
  );
}
