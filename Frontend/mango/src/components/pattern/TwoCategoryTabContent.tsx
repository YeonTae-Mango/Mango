import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { getTwoCategoryChart } from '../../api/ChartWebview';
import { useAuthStore } from '../../store/authStore';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';

interface TwoCategoryTabContentProps {
  activeTab: 'type' | 'category' | 'keyword' | 'time';
  userName: string;
  otherUserId?: number; // 비교할 사용자 ID
}

export default function TwoCategoryTabContent({ activeTab, userName, otherUserId }: TwoCategoryTabContentProps) {
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
        console.log('📊 두 카테고리 비교 차트 데이터 조회 시작');
        const data = await getTwoCategoryChart(user.id, otherUserId);
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
    console.log('TwoCategory WebView loaded successfully');
    setLoading(false);
    setError(null);
    setTimeout(() => {
      if (chartData) {
        console.log('Sending twoCategory data (fallback):', chartData);
        postMessage({ 
          type: 'twoCategory', 
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
        console.log('Chart ready, sending twoCategory data');
        if (chartData) {
          console.log('Sending twoCategory data to chart:', chartData);
          postMessage({ 
            type: 'twoCategory', 
            data: chartData
          });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View>
      <View className="px-4 mt-6">
        <View className="relative">
          <WebView
            ref={webviewRef}
            source={{ uri: `https://j13a408.p.ssafy.io/twoCategoryChart` }}
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

      {/* JSON 데이터 표시 */}
      {/* {chartData && (
        <View className="px-4 mb-4">
          <View className="bg-white rounded-lg p-4">
            <Text className="text-body-medium-semibold text-text-primary mb-2">
              전송된 JSON 데이터:
            </Text>
            <Text className="text-body-small-regular text-text-secondary">
              {JSON.stringify(chartData, null, 2)}
            </Text>
          </View>
        </View>
      )} */}

      {/* 비교 카드 - TwoCategory 전용 */}
      <View className="px-4 mb-6">
        <View className="bg-gray rounded-2xl p-6 shadow-sm">


          {/* myHighest와 otherHighest 데이터가 있으면 1등 비교 표시 */}
          {chartData?.data?.myHighest && chartData?.data?.otherHighest ? (
            <View className="items-center">
              <Text className="text-body-large-regular text-text-primary text-center mb-2">
                나는 
                <Text className="font-bold">
                  {' '}{Object.keys(chartData.data.myHighest)[0]}
                </Text>
                에 
                <Text className="font-bold">
                  {' '}{chartData.data.myHighest[Object.keys(chartData.data.myHighest)[0]]}%
                </Text>
                ,
              </Text>
              <Text className="text-body-large-regular text-text-primary text-center mb-2">
                상대는 
                <Text className="font-bold">
                  {' '}{Object.keys(chartData.data.otherHighest)[0]}
                </Text>
                에 
                <Text className="font-bold">
                  {' '}{chartData.data.otherHighest[Object.keys(chartData.data.otherHighest)[0]]}%
                </Text>
                로
              </Text>
              <Text className="text-body-large-regular text-text-primary text-center">
                가장 많이 소비했어요!
              </Text>
            </View>
          ) : (
            /* 기본 메시지 */
            <Text className="text-body-large-regular text-text-primary text-center">
              대분류에서의 소비 패턴을 비교해보세요!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
