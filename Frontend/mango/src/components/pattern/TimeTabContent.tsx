import React, { useRef, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';
import { TimeChartData } from '../../types/chart';

interface TimeTabContentProps {
  timeData: Array<{
    time: string;
    percentage: number;
    color: string;
  }>;
  timeApiData: TimeChartData | null;
  additionalInfoData: {
    time: {
      peakTime: string;
    };
  };
}

export default function TimeTabContent({ timeData, timeApiData, additionalInfoData }: TimeTabContentProps) {
  const tooltipOn = false; // 툴팁 기능 온오프 설정
  
  const baseUrl = EXPO_PUBLIC_WEBVIEW_BASE_URL || 'http://70.12.246.220:5173';
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

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
    console.log('Time WebView loaded successfully');
    setLoading(false);
    setError(null);
    // 기본 지연 (WebView에서 준비 완료 신호를 받지 못할 경우를 대비)
    setTimeout(() => {
      if (timeApiData && timeApiData.myData) {
        console.log('Sending time data (fallback):', timeApiData.myData);
        postMessage({ type: 'time', data: timeApiData.myData });
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
        console.log('Chart ready, sending time data');
        if (timeApiData && timeApiData.myData) {
          console.log('Sending time data to chart:', timeApiData.myData);
          postMessage({ type: 'time', data: timeApiData.myData });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // API 데이터가 있으면 사용, 없으면 기본 데이터 사용
  const displayData = timeApiData || {
    myData: [40, 128, 105, 87],
    yourData: [40, 128, 105, 87],
    timeLabels: ['새벽', '오전', '오후', '야간'],
    hotTime: '오전 6시 ~ 정오'
  };

  // 최소값과 최대값 찾기
  const minValue = Math.min(...displayData.myData);
  const maxValue = Math.max(...displayData.myData);

  // 색상 결정 함수
  const getTimeColor = (value: number) => {
    if (value === maxValue) return 'bg-orange-500';
    if (value === minValue) return 'bg-green-500';
    return 'bg-gray';
  };

  // 탭별 내용 렌더링 함수
  const renderTabContent = () => {
    return (
      <View className="px-4 pb-8">
        <View className="flex-row justify-between mb-4">
          {displayData.timeLabels.map((time, index) => (
            <View key={index} className="items-center">
              <Text className="text-body-medium-regular text-text-secondary mb-2">{time}</Text>
              <View className={`${getTimeColor(displayData.myData[index])} rounded-xl w-20 py-2 items-center`}>
                <Text className={`text-body-large-semibold ${
                  getTimeColor(displayData.myData[index]) === 'bg-gray' ? 'text-text-primary' : 'text-white'
                }`}>
                  {displayData.myData[index]}회
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
    // API 데이터가 있으면 hotTime 사용, 없으면 additionalInfoData 사용
    let peakTime = displayData.hotTime[0] || additionalInfoData.time.peakTime;
    
    // 중복된 시간대 문자열 제거 (예: "오전6시 ~ 정오오전6시 ~ 정오" -> "오전6시 ~ 정오")
    if (peakTime && peakTime.length > 10) {
      const halfLength = Math.floor(peakTime.length / 2);
      const firstHalf = peakTime.substring(0, halfLength);
      const secondHalf = peakTime.substring(halfLength);
      
      // 앞쪽과 뒤쪽이 같으면 앞쪽만 사용
      if (firstHalf === secondHalf) {
        peakTime = firstHalf;
      }
    }
    
    return (
      <View className="px-4 pb-8">
        <View className="bg-gray rounded-2xl p-4">
          <View className="items-center">
            <Text className="text-body-large-regular text-text-primary text-center mb-2">
              <Text className='font-bold'>
                {peakTime}
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
      {/* 시간대 전용 웹뷰 차트 영역 */}
      <View className="px-4 mt-6">
        <View className="relative">
          <WebView
            ref={webviewRef}
            source={{ uri: `${baseUrl}/myTimeChart` }}
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
          
          {/* 물음표 도움말 버튼 */}
          {tooltipOn && (
            <TouchableOpacity
              className="absolute top-2 right-2 w-8 h-8 bg-text-primary rounded-full items-center justify-center z-10"
              onPress={() => setShowTooltip(!showTooltip)}
            >
              <Text className="text-white text-lg font-bold">?</Text>
            </TouchableOpacity>
          )}
          
          {/* 툴팁 */}
          {tooltipOn && showTooltip && (
            <View className="absolute top-10 right-2 bg-text-primary rounded-lg px-3 py-2 max-w-48 z-20">
              <Text className="text-white text-sm">hello</Text>
            </View>
          )}
        
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
