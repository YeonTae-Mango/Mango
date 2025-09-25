import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { getMyKeywordChart } from '../../api/ChartWebview';
import { useAuthStore } from '../../store/authStore';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';
import { getKeywordFromCategory } from '../../utils/keywordMapping';

interface TwoKeywordTabContentProps {
  activeTab: 'type' | 'category' | 'keyword' | 'time';
  userName: string;
  otherUserId?: number; // 비교할 사용자 ID
}

export default function TwoKeywordTabContent({ activeTab, userName, otherUserId }: TwoKeywordTabContentProps) {
  const baseUrl = EXPO_PUBLIC_WEBVIEW_BASE_URL || 'http://70.12.246.220:5173';
  const { user } = useAuthStore();
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myKeywordData, setMyKeywordData] = useState<any>(null);
  const [otherKeywordData, setOtherKeywordData] = useState<any>(null);

  // API 데이터 조회
  useEffect(() => {
    const fetchKeywordData = async () => {
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
        // 내 키워드 데이터 조회
        console.log('📊 내 키워드 차트 데이터 조회 시작');
        const myData = await getMyKeywordChart(user.id);
        setMyKeywordData(myData);
        console.log('📊 내 키워드 차트 데이터 설정 완료:', myData);

        // 상대방 키워드 데이터 조회
        console.log('📊 상대방 키워드 차트 데이터 조회 시작');
        const otherData = await getMyKeywordChart(otherUserId);
        setOtherKeywordData(otherData);
        console.log('📊 상대방 키워드 차트 데이터 설정 완료:', otherData);

      } catch (error) {
        console.error('❌ 키워드 차트 데이터 조회 실패:', error);
        setError('키워드 차트 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchKeywordData();
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
    console.log('TwoKeyword WebView loaded successfully');
    setLoading(false);
    setError(null);
    setTimeout(() => {
      if (myKeywordData && otherKeywordData) {
        console.log('Sending twoKeyword data (fallback):', { myKeywordData, otherKeywordData });
        postMessage({ 
          type: 'twoKeyword', 
          data: {
            myData: myKeywordData,
            otherData: otherKeywordData
          }
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
        console.log('Chart ready, sending twoKeyword data');
        if (myKeywordData && otherKeywordData) {
          console.log('Sending twoKeyword data to chart:', { myKeywordData, otherKeywordData });
          postMessage({ 
            type: 'twoKeyword', 
            data: {
              myData: myKeywordData,
              otherData: otherKeywordData
            }
          });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // 상대방 키워드 3개와 설명 가져오기 (utils 사용)
  const getOtherKeywordsWithDescriptions = (data: any) => {
    if (!data || !data.labels || !Array.isArray(data.labels)) {
      return [
        getKeywordFromCategory('경기관람'),
        getKeywordFromCategory('전시장'),
        getKeywordFromCategory('공연관람')
      ];
    }
    return data.labels.slice(0, 3).map((category: string) => getKeywordFromCategory(category));
  };

  // 상대방 키워드 3개와 설명 계산
  const otherKeywordsWithDescriptions = otherKeywordData 
    ? getOtherKeywordsWithDescriptions(otherKeywordData) 
    : [
        getKeywordFromCategory('경기관람'),
        getKeywordFromCategory('전시장'),
        getKeywordFromCategory('공연관람')
      ];

  // API 데이터가 변경될 때마다 차트에 전송
  useEffect(() => {
    if (myKeywordData && otherKeywordData && !loading) {
      console.log('📊 API 데이터 변경됨, 차트에 전송:', { myKeywordData, otherKeywordData });
      postMessage({ 
        type: 'twoKeyword', 
        data: {
          myData: myKeywordData,
          otherData: otherKeywordData
        }
      });
    }
  }, [myKeywordData, otherKeywordData, loading]);

  return (
    <View>
      <View className="px-4 mt-6">
        <View className="relative">
          <WebView
            ref={webviewRef}
            source={{ uri: `https://j13a408.p.ssafy.io/twoKeywordChart` }}
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

      {/* 상대방 키워드 3개 표시 */}
      <View className="px-4 mb-6">
        <View className="bg-gray rounded-2xl p-6 shadow-sm">
          {/* 제목 */}
          <Text className="text-body-large-semibold text-text-primary text-center mb-4">
            <Text className="font-bold">{userName}</Text>님의 키워드
          </Text>

          {/* 키워드 3개와 설명 표시 */}
          <View className="items-start">
            {otherKeywordData?.data?.labels?.slice(0, 3).map((category: string, index: number) => {
              const keywordInfo = getKeywordFromCategory(category);
              return (
                <View key={index} className="items-start mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-text-secondary rounded-xl px-2 py-1 mr-2">
                      <Text className="text-body-large-regular text-white font-bold">
                        #{keywordInfo.keyword}
                      </Text>
                    </View>
                    <Text className="text-body-large-regular text-text-primary font-bold">
                      {keywordInfo.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
