import React, { useRef, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';
import { CategoryChartData, HistoryChartData } from '../../types/chart';
import ChartTooltip from '../common/ChartTooltip';

interface HistoryTabContentProps {
  categoryData: CategoryChartData | null;
  historyApiData: HistoryChartData | null;
  formatAmount: (amount: number) => string;
  historyData: {
    totalAmount: number;
    increaseRate: number;
  };
}

export default function HistoryTabContent({ categoryData, historyApiData, formatAmount, historyData }: HistoryTabContentProps) {
  const baseUrl = EXPO_PUBLIC_WEBVIEW_BASE_URL || 'http://70.12.246.220:5173';
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 툴팁 상태

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
    console.log('History WebView loaded successfully');
    setLoading(false);
    setError(null);
    // 기본 지연 (WebView에서 준비 완료 신호를 받지 못할 경우를 대비)
    setTimeout(() => {
      if (historyApiData) {
        console.log('Sending history data (fallback):', historyApiData);
        postMessage({ type: 'history', data: historyApiData });
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
        console.log('Chart ready, sending history data');
        if (historyApiData) {
          console.log('Sending history data to chart:', historyApiData);
          postMessage({ type: 'history', data: historyApiData });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // API 데이터가 변경될 때마다 차트에 전송
  useEffect(() => {
    if (historyApiData && !loading) {
      console.log('📊 내역 API 데이터 변경됨, 차트에 전송:', historyApiData);
      postMessage({ type: 'history', data: historyApiData });
    }
  }, [historyApiData, loading]);

  // API 데이터가 없으면 기본 데이터 사용
  const displayData = categoryData || {
    labels: ['식비', '소매/유통', '여가/오락', '미디어/통신', '학문/교육', '공연/전시', '생활서비스'],
    data: [232130, 232130, 232130, 232130, 232130, 232130, 232130],
    weight: [20, 20, 20, 20, 10, 5, 5],
    total: '1232130',
    highest: {}
  };

  // 이번달 누적 소비액 계산 (thisMonthRaw에서 null이 아닌 마지막 값)
  const getTotalAmount = () => {
    if (historyApiData && historyApiData.thisMonthRaw) {
      // thisMonthRaw 배열에서 null이 아닌 마지막 값 찾기
      const validValues = historyApiData.thisMonthRaw.filter(value => value !== null && value !== undefined);
      if (validValues.length > 0) {
        const lastValue = validValues[validValues.length - 1];
        // API에서 받은 값이 이미 만원 단위이므로 그대로 반환
        return lastValue;
      }
    }
    // API 데이터가 없으면 기본값 사용
    return parseInt(displayData.total) || historyData.totalAmount;
  };

  // 전월 대비 증감률 계산
  const getIncreaseRate = () => {
    if (historyApiData && historyApiData.lastMonth && historyApiData.thisMonthRaw && historyApiData.todayIndex !== undefined) {
      const lastMonthValue = historyApiData.lastMonth[historyApiData.todayIndex];
      const thisMonthValue = historyApiData.thisMonthRaw[historyApiData.todayIndex];
      
      if (lastMonthValue !== null && lastMonthValue !== undefined && 
          thisMonthValue !== null && thisMonthValue !== undefined) {
        const increaseRate = ((thisMonthValue - lastMonthValue) / lastMonthValue) * 100;
        return {
          rate: Math.abs(increaseRate),
          isIncrease: increaseRate >= 0
        };
      }
    }
    // API 데이터가 없으면 기본값 사용
    return {
      rate: historyData.increaseRate,
      isIncrease: true
    };
  };

  const colors = ['bg-orange-500', 'bg-pink-500', 'bg-yellow-500', 'bg-teal-500', 'bg-blue-500', 'bg-gray', 'bg-purple-500'];

  // 탭별 내용 렌더링 함수
  const renderTabContent = () => {
    return (
      <View className="px-4 pb-8">
        {/* 총 누적 소비액 */}
        <View className="bg-gray rounded-2xl p-4 mb-6">
          <Text className="text-body-large-semibold text-text-primary mb-2 text-center">
            이번 달 누적 소비액
          </Text>
          <Text className="text-heading-bold text-text-primary mb-2 text-center">
            {getTotalAmount().toLocaleString() + '만원'}
          </Text>
          {(() => {
            const increaseData = getIncreaseRate();
            return (
              <Text className={`text-body-medium-semibold text-center ${
                increaseData.isIncrease ? 'text-green-500' : 'text-red-500'
              }`}>
                {historyApiData?.todayIndex !== undefined ? 
                  `${historyApiData.todayIndex + 1}일 기준` :
                  `${new Date().getDate()}일 기준`
                } 전월 대비 {increaseData.isIncrease ? '+' : '-'}{increaseData.rate.toFixed(1)}% {increaseData.isIncrease ? '증가' : '감소'}
              </Text>
            );
          })()}
        </View>

        {/* 내역 목록 */}
        {/* <View className="space-y-3">
          {displayData.labels.map((label, index) => (
            <View 
              key={index} 
              className="flex-row items-center justify-between mb-2 py-2"
            >
              <View className="flex-row items-center">
                <View className={`w-4 h-4 rounded-full ${colors[index % colors.length]} mr-3`} />
                <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                  {label}
                </Text>
                <Text className="text-body-large-regular text-text-secondary ml-3">
                  {displayData.weight[index]}%
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                  {formatAmount(displayData.data[index])}
                </Text>
              </View>
            </View>
          ))}
        </View> */}
      </View>
    );
  };

  // 추가사항 렌더링 함수 (내역 탭은 추가사항 없음)
  const renderAdditionalInfo = () => {
    return null; // 내역 탭은 추가사항 없음
  };

  return (
    <View>
      {/* 탭과 웹뷰 사이의 툴팁 영역 */}
      <ChartTooltip type="history" enabled={true} />

      {/* 내역 전용 웹뷰 차트 영역 */}
      <View className="px-4 mt-2">
        <View className="relative">
          <WebView
            ref={webviewRef}
            source={{ uri: `${baseUrl}/myThisMonthChart` }}
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
