import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import ComparisonCard from '../../components/pattern/ComparisonCard';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import MatchingPatternTab from '../../components/pattern/MatchingPatternTab';
import PatternWebView from '../../components/pattern/PatternWebView';

export default function MatchingpatternScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName } = route.params as { userName: string };
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'type' | 'category' | 'keyword' | 'time'>('type');
  
  // 탭별 제목 배열
  const tabTitles = {
    type: '대표유형 비교',
    category: '카테고리 비교',
    keyword: 'Top3 키워드 비교',
    time: '시간대 비교'
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="소비패턴 궁합"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 패턴비교 탭 */}
        <MatchingPatternTab
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />


        {/* 웹뷰 영역 (회색 상자) */}
        <PatternWebView activeTab={activeTab} />

        {/* 유형 비교 카드 */}
        <ComparisonCard
          activeTab={activeTab}
          userName={userName}
        />
      </ScrollView>
    </Layout>
  );
}
