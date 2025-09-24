import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { EXPO_PUBLIC_WEBVIEW_BASE_URL } from '@env';
import { KeywordChartData } from '../../types/chart';
import { getKeywordFromCategory } from '../../utils/keywordMapping';

interface KeywordTabContentProps {
  keywordApiData: KeywordChartData | null;
  additionalInfoData: {
    keyword: Array<{
      keyword: string;
      description: string;
      color: string;
    }>;
  };
}

export default function KeywordTabContent({ keywordApiData, additionalInfoData }: KeywordTabContentProps) {
  const baseUrl = EXPO_PUBLIC_WEBVIEW_BASE_URL || 'http://70.12.246.220:5173';
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
    console.log('Keyword WebView loaded successfully');
    setLoading(false);
    setError(null);
    // 기본 지연 (WebView에서 준비 완료 신호를 받지 못할 경우를 대비)
    setTimeout(() => {
      if (keywordApiData) {
        console.log('Sending keyword data (fallback):', keywordApiData);
        postMessage({ type: 'keyword', data: keywordApiData });
        console.log('baseUrl', baseUrl);
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
        console.log('Chart ready, sending keyword data');
        if (keywordApiData) {
          console.log('Sending keyword data to chart:', keywordApiData);
          postMessage({ type: 'keyword', data: keywordApiData });
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // API 데이터가 있으면 사용, 없으면 기본 데이터 사용
  const displayData = keywordApiData || {
    labels: ['앱프론트', '#메케닉', '#편의점러버', '#아티스트', '#탑건', '#트렌드세터'],
    data: [100, 80, 60, 40, 20, 10]
  };


  // 추가사항 렌더링 함수
  const renderAdditionalInfo = () => {
    // 첫 번째, 두 번째, 세 번째 소분류의 키워드 정보 가져오기
    const firstKeyword = getKeywordFromCategory(displayData.labels[0]);
    const secondKeyword = getKeywordFromCategory(displayData.labels[1]);
    const thirdKeyword = getKeywordFromCategory(displayData.labels[2]);
    
    return (
      <View className="px-4 pb-8">
        <View className="bg-gray rounded-2xl p-4">
          <View className="items-center">
            <View className="items-center mb-2">
              <View className="flex-row items-center">
                <View className="bg-text-secondary rounded-xl px-2 py-1 mr-2">
                  <Text className="text-body-large-regular text-white font-bold">
                    #{firstKeyword.keyword}
                  </Text>
                </View>
                <Text className="text-body-large-regular text-text-primary font-bold">
                  {firstKeyword.description}
                </Text>
              </View>
            </View>
            <View className="items-center mb-2">
              <View className="flex-row items-center">
                <View className="bg-text-secondary rounded-xl px-2 py-1 mr-2">
                  <Text className="text-body-large-regular text-white font-bold">
                    #{secondKeyword.keyword}
                  </Text>
                </View>
                <Text className="text-body-large-regular text-text-primary font-bold">
                  {secondKeyword.description}
                </Text>
              </View>
            </View>
            <View className="items-center">
              <View className="flex-row items-center">
                <View className="bg-text-secondary rounded-xl px-2 py-1 mr-2">
                  <Text className="text-body-large-regular text-white font-bold">
                    #{thirdKeyword.keyword}
                  </Text>
                </View>
                <Text className="text-body-large-regular text-text-primary font-bold">
                  {thirdKeyword.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* 키워드 전용 웹뷰 차트 영역 */}
      <View className="px-4 mt-6">
        <View className="relative">
          <WebView
            ref={webviewRef}
            source={{ uri: `${baseUrl}/myKeywordChart` }} 
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

      
      {/* 추가사항 */}
      {renderAdditionalInfo()}
    </View>
  );
}
