import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import AdditionalInfo from '../../components/pattern/AdditionalInfo';
import CategoryTabContent from '../../components/pattern/CategoryTabContent';
import HistoryTabContent from '../../components/pattern/HistoryTabContent';
import KeywordTabContent from '../../components/pattern/KeywordTabContent';
import MonthTabContent from '../../components/pattern/MonthTabContent';
import MyPatternTab from '../../components/pattern/MyPatternTab';
import PatternWebView from '../../components/pattern/PatternWebView';
import TimeTabContent from '../../components/pattern/TimeTabContent';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';

export default function MyPatternScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'category' | 'month' | 'keyword' | 'time' | 'history'>('category');

  // 카테고리별 소비 데이터
  const categoryData = [
    { name: '식비', percentage: 20, amount: 232130, color: 'bg-orange-500' },
    { name: '소매/유통', percentage: 20, amount: 232130, color: 'bg-pink-500' },
    { name: '여가/오락', percentage: 20, amount: 232130, color: 'bg-yellow-500' },
    { name: '미디어/통신', percentage: 20, amount: 232130, color: 'bg-teal-500' },
    { name: '학문/교육', percentage: 10, amount: 232130, color: 'bg-blue-500' },
    { name: '공연/전시', percentage: 5, amount: 232130, color: 'bg-gray' },
    { name: '생활서비스', percentage: 5, amount: 232130, color: 'bg-purple-500' },
  ];

  // 월별 데이터
  const monthData = [
    { month: '4월', amount: 856540, color: 'bg-gray' },
    { month: '5월', amount: 952300, color: 'bg-gray' },
    { month: '6월', amount: 232130, color: 'bg-green-500' },
    { month: '7월', amount: 120450, color: 'bg-gray' },
    { month: '8월', amount: 3223000, color: 'bg-orange-500' },
    { month: '9월 누적', amount: 723000, color: 'bg-gray' },
  ];

  // 시간대별 데이터
  const timeData = [
    { time: '오전', percentage: 12, color: 'bg-gray' },
    { time: '오후', percentage: 5, color: 'bg-green-500' },
    { time: '저녁', percentage: 28, color: 'bg-orange-500' },
    { time: '새벽', percentage: 15, color: 'bg-gray' },
  ];

  // 키워드 데이터
  const keywordData = [
    { keyword: '#경기관람', description: '스포츠 관람을 좋아하는 스타일!', color: 'bg-pink-500' },
    { keyword: '#단발병', description: '미용과 헤어케어를 좋아하는 스타일!', color: 'bg-green-500' },
    { keyword: '#간식창고', description: '다양한 간식을 좋아하는 스타일!', color: 'bg-yellow-500' },
  ];

  // 내역 탭 데이터
  const historyData = {
    totalAmount: 1232130,
    increaseRate: 10,
  };

  // 추가사항 데이터
  const additionalInfoData = {
    month: {
      increaseRate: 100,
      peakMonth: '8월',
    },
    keyword: keywordData,
    time: {
      peakTime: '오후 6시 ~ 오후 12시',
    },
    category: {
      topCategories: [
        { name: '음식', percentage: 32 },
        { name: '미디어/통신', percentage: 22 },
      ],
    },
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + '원';
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="내 소비패턴 분석"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 탭 */}
        <MyPatternTab
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 카테고리별 소비 섹션 */}
        <View className="px-4 mt-6">
          {/* 웹뷰 차트 영역 */}
          <PatternWebView activeTab={activeTab} />

          {/* 탭에 따른 내용 렌더링 */}
          {activeTab === 'month' && (
            <MonthTabContent 
              monthData={monthData}
              formatAmount={formatAmount}
            />
          )}
          {activeTab === 'keyword' && <KeywordTabContent />}
          {activeTab === 'time' && (
            <TimeTabContent 
              timeData={timeData}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTabContent 
              categoryData={categoryData} 
              formatAmount={formatAmount}
              historyData={historyData}
            />
          )}
          {activeTab === 'category' && (
            <CategoryTabContent 
              categoryData={categoryData} 
              formatAmount={formatAmount} 
            />
          )}
        </View>

        {/* 추가사항 - 내역 탭 제외 */}
        <AdditionalInfo 
          activeTab={activeTab}
          additionalInfoData={additionalInfoData}
        />
      </ScrollView>
    </Layout>
  );
}