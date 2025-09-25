import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Alert, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';
import { CategoryChartData } from '../../types/chart';

interface CategoryTabContentProps {
  categoryData: CategoryChartData | null;
  formatAmount: (amount: number) => string;
  additionalInfoData: {
    category: {
      topCategories: Array<{
        name: string;
        percentage: number;
      }>;
    };
  };
  selectedPeriod: number; // 현재 선택된 기간
  onPeriodChange?: (period: number) => void; // 기간 변경 콜백
}

export default function CategoryTabContent({ categoryData, formatAmount, additionalInfoData, selectedPeriod, onPeriodChange }: CategoryTabContentProps) {
  const baseUrl = EXPO_PUBLIC_WEBVIEW_BASE_URL || 'https://j13a408.p.ssafy.io';
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 드랍다운 표시 상태
  const [showDropdown, setShowDropdown] = useState(false);
  
  // 기간 옵션 데이터
  const periodOptions = [
    { value: 1, label: '이번 달' },
    { value: 2, label: '지난 달' },
    { value: 3, label: '최근 6개월' }
  ];

  // 기간 선택 핸들러
  const handlePeriodChange = (period: number) => {
    setShowDropdown(false);
    console.log(`📊 기간 변경: ${periodOptions.find(opt => opt.value === period)?.label} (${period})`);
    
    // 상위 컴포넌트에 기간 변경 알림
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  // 드랍다운 컴포넌트 렌더링
  const renderDropdown = () => {
    const selectedOption = periodOptions.find(opt => opt.value === selectedPeriod);
    
    return (
      <View className="relative">
        {/* 드랍다운 버튼 */}
        <TouchableOpacity
          className="bg-white border border-stroke rounded-lg px-3 py-2 flex-row items-center justify-between w-full"
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text className="text-body-medium-regular text-text-primary">
            {selectedOption?.label}
          </Text>
          <Text className="text-text-secondary ml-2">▼</Text>
        </TouchableOpacity>

        {/* 드랍다운 메뉴 */}
        {showDropdown && (
          <View className="absolute top-full left-0 w-full bg-white border border-stroke rounded-lg mt-1 z-10 shadow-lg">
            {periodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`px-3 py-3 border-b border-gray-100 last:border-b-0 ${
                  selectedPeriod === option.value ? 'bg-blue-50' : ''
                }`}
                onPress={() => handlePeriodChange(option.value)}
              >
                <Text className={`text-body-medium-regular ${
                  selectedPeriod === option.value ? 'text-blue-600 font-semibold' : 'text-text-primary'
                }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // 카테고리 탭 마운트 시 웹뷰 캐시 모두 지우기
  useEffect(() => {
    console.log('카테고리 탭: 웹뷰 캐시 비활성화 모드로 로드');
  }, []);

  const postMessage = (message: any) => {
    if (!webviewRef.current) return;
    webviewRef.current.postMessage(JSON.stringify(message));
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError(nativeEvent.description || 'WebView 로딩 중 오류가 발생했습니다.');
    setLoading(false);
  };

  const handleWebViewLoad = () => {
    console.log('Category WebView loaded successfully');
    setLoading(false);
    setError(null);
    // 기본 지연 (WebView에서 준비 완료 신호를 받지 못할 경우를 대비)
    setTimeout(() => {
      if (categoryData) {
        console.log('Sending category data (fallback):', categoryData);
        postMessage({ type: 'category', data: categoryData });
      }
    }, 10);
  };

  const handleWebViewLoadEnd = () => {
    setLoading(false);
  };

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'chartReady') {
        console.log('Chart ready, sending category data');
        if (categoryData) {
          console.log('Sending category data to chart:', categoryData);
          postMessage({ type: 'category', data: categoryData });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // API 데이터가 변경될 때마다 차트에 전송
  useEffect(() => {
    if (categoryData && !loading) {
      console.log('📊 카테고리 API 데이터 변경됨, 차트에 전송:', categoryData);
      postMessage({ type: 'category', data: categoryData });
    }
  }, [categoryData, loading]);
  // 탭별 내용 렌더링 함수
  const renderTabContent = () => {
    // API 데이터가 없으면 기본 데이터 표시
    if (!categoryData) {
      const defaultData = [
        { name: '식비', percentage: 20, amount: 232130, color: 'bg-orange-500' },
        { name: '소매/유통', percentage: 20, amount: 232130, color: 'bg-pink-500' },
        { name: '여가/오락', percentage: 20, amount: 232130, color: 'bg-yellow-500' },
        { name: '미디어/통신', percentage: 20, amount: 232130, color: 'bg-teal-500' },
        { name: '학문/교육', percentage: 10, amount: 232130, color: 'bg-blue-500' },
        { name: '공연/전시', percentage: 5, amount: 232130, color: 'bg-gray' },
        { name: '생활서비스', percentage: 5, amount: 232130, color: 'bg-purple-500' },
      ];

      return (
        <View className="px-4 pb-3">
          <View className="space-y-3">
            {defaultData.map((category, index) => (
              <View key={index} className="flex-row items-center justify-between mb-2 py-2">
                <View className="flex-row items-center">
                  <View className={`w-4 h-4 rounded-full ${category.color} mr-3`} />
                  <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                    {category.name}
                  </Text>
                  <Text className="text-body-large-regular text-text-secondary ml-3">
                    {category.percentage}%
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                    {formatAmount(category.amount)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      );
    }

    // API 데이터를 사용하여 렌더링
    const colors = ['bg-orange-500', 'bg-pink-500', 'bg-yellow-500', 'bg-teal-500', 'bg-blue-500', 'bg-gray', 'bg-purple-500'];

    return (
      <View className="px-4">
        <View className="space-y-3">
          {categoryData.labels.map((label, index) => (
            <View key={index} className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className={`w-4 h-4 rounded-full ${colors[index % colors.length]} mr-3`} />
                <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                  {label}
                </Text>
                <Text className="text-body-large-regular text-text-secondary ml-3">
                  {categoryData.weight[index]}%
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                  {formatAmount(categoryData.data[index])}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // 추가사항 렌더링 함수
  const renderAdditionalInfo = () => {
    return (
      <View className="px-4 pb-8">
        <View className="bg-gray rounded-2xl p-4">
          <View className="items-center">
            {categoryData?.highest ? (
              <>
                <Text className="text-body-large-regular text-text-primary text-center mb-2">
                  {Object.keys(categoryData.highest)[1]}에 
                  <Text className='font-bold'>
                    {' '}{categoryData.highest[Object.keys(categoryData.highest)[1]]}%
                  </Text>
                  , {Object.keys(categoryData.highest)[0]}에 
                  <Text className='font-bold'>
                    {' '}{categoryData.highest[Object.keys(categoryData.highest)[0]]}%
                  </Text>
                  로
                </Text>
                <Text className="text-body-large-regular text-text-primary text-center">
                  가장 많은 소비를 했어요!
                </Text>
              </>
            ) : (
              <>
                <Text className="text-body-large-regular text-text-primary text-center mb-2">
                  {additionalInfoData.category.topCategories[0].name}에 
                  <Text className='font-bold'>
                    {' '}{additionalInfoData.category.topCategories[0].percentage}%
                  </Text>
                  , {additionalInfoData.category.topCategories[1].name}에 
                  <Text className='font-bold'>
                    {' '}{additionalInfoData.category.topCategories[1].percentage}%
                  </Text>
                  로
                </Text>
                <Text className="text-body-large-regular text-text-primary text-center">
                  가장 많은 소비를 했어요!
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* 드랍다운 외부 클릭 시 닫기 */}
      {showDropdown && (
        <TouchableOpacity 
          className="absolute inset-0 z-10" 
          onPress={() => setShowDropdown(false)}
        />
      )}
      
      {/* 카테고리 전용 웹뷰 차트 영역 */}
      <View className="px-4 mt-6">
        <View className="relative">
          {/* 기간 선택 드랍다운 */}
          <View className="relative w-32 top-2 right-2 z-20 mb-2 ml-auto">
            {renderDropdown()}
          </View>
          
          <WebView
            ref={webviewRef}
            source={{ uri: `${baseUrl}/myCategoryChart` }}
            style={{ height: 400, borderRadius: 12 }}
            onLoad={handleWebViewLoad}
            onLoadEnd={handleWebViewLoadEnd}
            onError={handleWebViewError}
            onHttpError={handleWebViewError}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={false}
            cacheEnabled={false}
            incognito={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onShouldStartLoadWithRequest={() => true}
          />
        
        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-white rounded-lg">
            <Text className="text-body-medium-regular text-text-secondary">차트를 불러오는 중...</Text>
          </View>
        )}
        
        {error && (
          <View className="absolute inset-0 justify-center items-center bg-white rounded-lg">
            <Text className="text-body-medium-regular text-red-500 text-center px-4">{error}</Text>
          </View>
        )}
        </View>
      </View>

      {/* 탭별 내용 */}
      {renderTabContent()}
      
      {/* 추가사항 */}
      {renderAdditionalInfo()}
    </View>
  );
}
