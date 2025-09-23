import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';
import { MonthlyChartData } from '../../types/chart';

interface MonthTabContentProps {
  monthData: Array<{
    month: string;
    amount: number;
    color: string;
  }>;
  monthlyApiData: MonthlyChartData | null;
  formatAmount: (amount: number) => string;
  additionalInfoData: {
    month: {
      increaseRate: number;
      peakMonth: string;
    };
  };
}

export default function MonthTabContent({ monthData, monthlyApiData, formatAmount, additionalInfoData }: MonthTabContentProps) {
  const baseUrl = EXPO_PUBLIC_WEBVIEW_BASE_URL || 'https://j13a408.p.ssafy.io';
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    console.log('Month WebView loaded successfully');
    setLoading(false);
    setError(null);
    // 기본 지연 (WebView에서 준비 완료 신호를 받지 못할 경우를 대비)
    setTimeout(() => {
      if (monthlyApiData) {
        console.log('Sending monthly data (fallback):', monthlyApiData);
        postMessage({ type: 'month', data: monthlyApiData });
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
        console.log('Chart ready, sending monthly data');
        if (monthlyApiData) {
          console.log('Sending monthly data to chart:', monthlyApiData);
          postMessage({ type: 'month', data: monthlyApiData });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // API 데이터가 있으면 사용, 없으면 기본 데이터 사용
  const displayData = monthlyApiData || {
    label: ['4', '5', '6', '7', '8', '9'],
    data: [1114300, 1415700, 818200, 1311000, 132000, 83460]
  };

  // 최소값과 최대값 찾기
  const minValue = Math.min(...displayData.data);
  const maxValue = Math.max(...displayData.data);

  // 색상 결정 함수
  const getMonthColor = (value: number) => {
    if (value === maxValue) return 'bg-orange-500';
    if (value === minValue) return 'bg-green-500';
    return 'bg-gray';
  };

  // 네 번째(7월)와 다섯 번째(8월) 데이터 비교
  const getMonthComparison = () => {
    if (displayData.data.length >= 5) {
      const fourthMonthValue = displayData.data[3]; // 7월 (인덱스 3)
      const fifthMonthValue = displayData.data[4];  // 8월 (인덱스 4)
      
      if (fourthMonthValue && fifthMonthValue) {
        const increaseRate = ((fifthMonthValue - fourthMonthValue) / fourthMonthValue) * 100;
        return {
          rate: Math.abs(increaseRate),
          isIncrease: increaseRate >= 0
        };
      }
    }
    // API 데이터가 없으면 기본값 사용
    return {
      rate: additionalInfoData.month.increaseRate,
      isIncrease: true
    };
  };

  // 탭별 내용 렌더링 함수
  const renderTabContent = () => {
    return (
      <View className="px-4 pb-8">
        <Text className="text-subheading-bold text-text-primary mb-4">
          최근 6개월 누적액
        </Text>
        
        {/* 첫 번째 줄: 4월, 5월, 6월 */}
        <View className="flex-row justify-between mb-4">
          {displayData.label.slice(0, 3).map((month, index) => (
            <View key={index} className="items-center">
              <Text className="text-body-medium-regular text-text-secondary mb-2">{month}월</Text>
              <View className={`${getMonthColor(displayData.data[index])} rounded-xl px-4 py-2`}>
                <Text className={`text-body-large-semibold ${
                  getMonthColor(displayData.data[index]) === 'bg-gray' ? 'text-text-primary' : 'text-white'
                }`}>
                  {formatAmount(displayData.data[index])}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 두 번째 줄: 7월, 8월, 9월 누적 */}
        <View className="flex-row justify-between mb-4">
          {displayData.label.slice(3, 6).map((month, index) => (
            <View key={index + 3} className="items-center">
              <Text className="text-body-medium-regular text-text-secondary mb-2">
                {index === 2 ? `${month}월 누적` : `${month}월`}
              </Text>
              <View className={`${getMonthColor(displayData.data[index + 3])} rounded-xl px-4 py-2`}>
                <Text className={`text-body-large-semibold ${
                  getMonthColor(displayData.data[index + 3]) === 'bg-gray' ? 'text-text-primary' : 'text-white'
                }`}>
                  {formatAmount(displayData.data[index + 3])}
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
    const comparisonData = getMonthComparison();
    
    return (
      <View className="px-4 pb-8">
        <View className="bg-gray rounded-2xl p-4">
          <View className="items-center">
            <Text className="text-body-large-regular text-text-primary text-center mb-2">
              전월 대비
              <Text className={`font-bold ${comparisonData.isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                {' '}{comparisonData.rate.toFixed(1)}%
              </Text>
              {comparisonData.isIncrease ? ' 증가' : ' 감소'}했고,
            </Text>
            <Text className="text-body-large-regular text-text-primary text-center mb-2">
              <Text className='font-bold'>
                {additionalInfoData.month.peakMonth}
              </Text>
              에 가장 많은 소비를 했어요!
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* 월별 전용 웹뷰 차트 영역 */}
      <View className="px-4 mt-6">
        <View className="relative">
          <WebView
            ref={webviewRef}
            source={{ uri: `${baseUrl}/myMonthlyChart` }}
            style={{ height: 400, borderRadius: 12 }}
            onLoad={handleWebViewLoad}
            onLoadEnd={handleWebViewLoadEnd}
            onError={handleWebViewError}
            onHttpError={handleWebViewError}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={false}
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
