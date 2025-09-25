import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { getTwoTimeChart } from '../../api/ChartWebview';
import { useAuthStore } from '../../store/authStore';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';

interface TwoTimeTabContentProps {
  activeTab: 'type' | 'category' | 'keyword' | 'time';
  userName: string;
  otherUserId?: number; // 비교할 사용자 ID
}

export default function TwoTimeTabContent({ activeTab, userName, otherUserId }: TwoTimeTabContentProps) {
  const baseUrl = EXPO_PUBLIC_WEBVIEW_BASE_URL || 'http://70.12.246.220:5173';
  const { user } = useAuthStore();
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  // API 데이터 조회
  useEffect(() => {
    const fetchChartData = async () => {
      if (!user?.id) {
        console.warn('❌ 현재 사용자 ID가 없습니다.');
        setError('현재 사용자 정보를 찾을 수 없습니다.');
        return;
      }

      if (!otherUserId) {
        console.warn('❌ 비교할 사용자 ID가 없습니다.');
        setError('비교할 사용자 정보를 찾을 수 없습니다.');
        return;
      }

      console.log('✅ 사용자 ID 확인 완료:', { myUserId: user.id, otherUserId });

      try {
        console.log('📊 두 시간대 비교 차트 데이터 조회 시작');
        const data = await getTwoTimeChart(user.id, otherUserId);
        setChartData(data);
        console.log('📊 차트 데이터 설정 완료:', data);
      } catch (error) {
        console.error('❌ 차트 데이터 조회 실패:', error);
        setError('차트 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchChartData();
  }, [user?.id, otherUserId]);

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
    console.log('TwoTime WebView loaded successfully');
    setLoading(false);
    setError(null);
    setTimeout(() => {
      if (chartData) {
        console.log('Sending twoTime data (fallback):', chartData);
        postMessage({ 
          type: 'twoTime', 
          data: chartData
        });
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
        console.log('Chart ready, sending twoTime data');
        if (chartData) {
          console.log('Sending twoTime data to chart:', chartData);
          postMessage({ 
            type: 'twoTime', 
            data: chartData
          });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // API 데이터가 변경될 때마다 차트에 전송
  useEffect(() => {
    if (chartData && !loading) {
      console.log('📊 시간대 API 데이터 변경됨, 차트에 전송:', chartData);
      postMessage({ 
        type: 'twoTime', 
        data: chartData
      });
    }
  }, [chartData, loading]);

  // 핫타임 배열에서 직접 가져오기 (첫 번째: 나, 두 번째: 상대방)
  const getHotTime = (data: any, index: number) => {
    if (!data || !data.hotTime || !Array.isArray(data.hotTime)) {
      return index === 0 ? '오전 6시 ~ 정오' : '정오 ~ 18시'; // 기본값
    }
    return data.hotTime[index] || (index === 0 ? '오전 6시 ~ 정오' : '정오 ~ 18시');
  };

  // 내 핫타임과 상대방 핫타임 계산
  const myTime = chartData?.data ? getHotTime(chartData.data, 0) : '오전 6시 ~ 정오';
  const otherTime = chartData?.data ? getHotTime(chartData.data, 1) : '정오 ~ 18시';

  return (
    <View>
      <View className="px-4 mt-6">
        <View className="relative">
          <WebView
            ref={webviewRef}
            source={{ uri: `https://j13a408.p.ssafy.io/twoTimeChart` }}
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

      {/* 비교 카드 - TwoTime 전용 */}
      <View className="px-4 mb-6">
        <View className="bg-gray rounded-2xl p-6 shadow-sm">
          {/* 내 시간대 */}
          <View className="flex-row items-center justify-center mb-4">
            <Text className="text-body-large-semibold text-text-primary mr-3">
              <Text className="font-bold">나</Text>는
            </Text>
            <View className="bg-blue-400 rounded-full px-4 py-2 flex-row items-center">
              <Text className="text-body-medium-semibold text-white">
                {myTime}
              </Text>
            </View>
          </View>

          {/* 상대방 시간대 */}
          <View className="flex-row items-center justify-center mb-4">
            <Text className="text-body-large-semibold text-text-primary mr-3">
              <Text className="font-bold">{userName}</Text>님은
            </Text>
            <View className="bg-mango-red rounded-full px-4 py-2 flex-row items-center">
              <Text className="text-body-medium-semibold text-white">
                {otherTime}
              </Text>
            </View>
          </View>

          {/* 결과 메시지 */}
          <Text className="text-body-large-regular text-text-primary text-center">
            시간대에 가장 많이 소비했어요!
          </Text>
        </View>
      </View>
    </View>
  );
}
