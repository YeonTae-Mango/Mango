import React from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface PatternWebViewProps {
  activeTab: 'type' | 'category' | 'keyword' | 'time' | 'month' | 'history';
}

export default function PatternWebView({ activeTab }: PatternWebViewProps) {

  // 탭별 웹뷰 메시지 설정
  const getWebViewMessage = () => {
    switch (activeTab) {
      case 'type':
        return {
          title: '대표유형 분석 결과',
          description: '유형별 소비 패턴 분석이 표시됩니다'
        };
      case 'category':
        return {
          title: '카테고리 분석 결과',
          description: '카테고리별 소비 패턴 분석이 표시됩니다'
        };
      case 'keyword':
        return {
          title: '키워드 분석 결과',
          description: 'Top3 키워드 분석이 표시됩니다'
        };
      case 'time':
        return {
          title: '시간대 분석 결과',
          description: '시간대별 소비 패턴 분석이 표시됩니다'
        };
      case 'month':
        return {
          title: '월별 분석 결과',
          description: '월별 소비 패턴 분석이 표시됩니다'
        };
      case 'history':
        return {
          title: '소비 내역 분석',
          description: '상세 소비 내역이 표시됩니다'
        };
      default:
        return {
          title: '웹뷰 영역',
          description: '소비패턴 분석 결과가 표시됩니다'
        };
    }
  };

  const webViewMessage = getWebViewMessage();

  return (
    <View className="px-4 pb-8">
      <View className="h-[400px] bg-gray rounded-2xl overflow-hidden">
        {activeTab === 'category' ? (
          <WebView
            source={{ uri: 'https://j13a408.p.ssafy.io/myCategoryChart' }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : activeTab === 'month' ? (
          <WebView
            source={{ uri: 'https://j13a408.p.ssafy.io/myMonthlyChart' }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : activeTab === 'keyword' ? (
          <WebView
            source={{ uri: 'https://j13a408.p.ssafy.io/myKeywordChart' }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : activeTab === 'history' ? (
          <WebView
            source={{ uri: 'https://j13a408.p.ssafy.io/myThisMonthChart' }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-body-large-regular text-text-primary">
              {webViewMessage.title}
            </Text>
            <Text className="text-body-medium-regular text-secondary mt-2">
              {webViewMessage.description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
