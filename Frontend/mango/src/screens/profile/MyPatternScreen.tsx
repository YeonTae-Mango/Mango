import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useCategoryChart, useMonthlyChart, useKeywordChart, useHistoryChart, useTimeChart } from '../../hooks/useChart';
import { getCurrentUserId } from '../../api/auth';
import AdditionalInfo from '../../components/pattern/AdditionalInfo';
import CategoryTabContent from '../../components/pattern/CategoryTabContent';
import HistoryTabContent from '../../components/pattern/HistoryTabContent';
import KeywordTabContent from '../../components/pattern/KeywordTabContent';
import MonthTabContent from '../../components/pattern/MonthTabContent';
import MyPatternTab from '../../components/pattern/MyPatternTab';
import TimeTabContent from '../../components/pattern/TimeTabContent';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';

export default function MyPatternScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'category' | 'month' | 'keyword' | 'time' | 'history'>('category');
  
  // auth.js에서 관리하는 사용자 ID 사용
  const [currentUserId, setCurrentUserId] = useState<number>(103); // 기본값 103
  
  // 카테고리 차트 기간 상태
  const [categoryPeriod, setCategoryPeriod] = useState<number>(1); // 기본값: 이번달
  
  // auth.js에서 사용자 ID 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        setCurrentUserId(userId);
      }
    };
    fetchUserId();
  }, []);
  
  // 카테고리 차트 API 호출 (period: 1=이번달, 2=저번달, 3=최근 6개월)
  const { data: categoryChartData, isLoading: categoryLoading, error: categoryError } = useCategoryChart(currentUserId, categoryPeriod);

  // 월별 차트 API 호출
  const { data: monthlyChartData, isLoading: monthlyLoading, error: monthlyError } = useMonthlyChart(currentUserId);

  // 키워드 차트 API 호출
  const { data: keywordChartData, isLoading: keywordLoading, error: keywordError } = useKeywordChart(currentUserId);

  // 내역 차트 API 호출
  const { data: historyChartData, isLoading: historyLoading, error: historyError } = useHistoryChart(currentUserId);

  // 시간대 차트 API 호출
  const { data: timeChartData, isLoading: timeLoading, error: timeError } = useTimeChart(currentUserId);

  // 카테고리 데이터 (API 응답을 그대로 사용)
  const categoryData = categoryChartData?.data || null;

  // 월별 데이터 (API 응답을 그대로 사용)
  const monthlyData = monthlyChartData?.data || null;

  // 키워드 데이터 (API 응답을 그대로 사용)
  const keywordApiData = keywordChartData?.data || null;

  // 내역 데이터 (API 응답을 그대로 사용)
  const historyApiData = historyChartData?.data || null;

  // 시간대 데이터 (API 응답을 그대로 사용)
  const timeApiData = timeChartData?.data || null;


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

  // 키워드 데이터 (추가사항용)
  const keywordFallbackData = [
    { keyword: '#경기관람', description: '스포츠 관람을 좋아하는 스타일!', color: 'bg-pink-500' },
    { keyword: '#단발병', description: '미용과 헤어케어를 좋아하는 스타일!', color: 'bg-green-500' },
    { keyword: '#간식창고', description: '다양한 간식을 좋아하는 스타일!', color: 'bg-yellow-500' },
  ];

  // 내역 탭 데이터
  const historyData = {
    totalAmount: 1232130,
    increaseRate: 10,
  };

  // 월별 데이터에서 최고값과 peakMonth 계산
  const getMonthlyInfo = () => {
    if (monthlyData && monthlyData.data && monthlyData.data.length > 0) {
      const maxValue = Math.max(...monthlyData.data);
      const maxIndex = monthlyData.data.indexOf(maxValue);
      const peakMonth = monthlyData.label[maxIndex] ? `${monthlyData.label[maxIndex]}월` : '8월';
      
      // 전월 대비 증가율 계산 (마지막 두 개월 비교)
      let increaseRate = 100; // 기본값
      if (monthlyData.data.length >= 2) {
        const lastMonth = monthlyData.data[monthlyData.data.length - 1];
        const prevMonth = monthlyData.data[monthlyData.data.length - 2];
        if (prevMonth > 0) {
          increaseRate = ((lastMonth - prevMonth) / prevMonth) * 100;
        }
      }
      
      return {
        increaseRate: Math.round(increaseRate),
        peakMonth: peakMonth,
      };
    }
    
    // API 데이터가 없으면 기본값 사용
    return {
      increaseRate: 100,
      peakMonth: '8월',
    };
  };

  // 추가사항 데이터
  const additionalInfoData = {
    month: getMonthlyInfo(),
    keyword: keywordFallbackData,
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

  // 카테고리 탭에서만 로딩/에러 상태 표시 (캐시된 데이터가 없을 때만)
  if (activeTab === 'category') {
    if (categoryLoading && !categoryData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">카테고리 데이터를 불러오는 중...</Text>
          </View>
        </Layout>
      );
    }

    if (categoryError && !categoryData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-red-600">카테고리 데이터를 불러오는데 실패했습니다.</Text>
          </View>
        </Layout>
      );
    }
  }

  // 월별 탭에서만 로딩/에러 상태 표시 (캐시된 데이터가 없을 때만)
  if (activeTab === 'month') {
    if (monthlyLoading && !monthlyData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">월별 데이터를 불러오는 중...</Text>
          </View>
        </Layout>
      );
    }

    if (monthlyError && !monthlyData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-red-600">월별 데이터를 불러오는데 실패했습니다.</Text>
          </View>
        </Layout>
      );
    }
  }

  // 키워드 탭에서만 로딩/에러 상태 표시 (캐시된 데이터가 없을 때만)
  if (activeTab === 'keyword') {
    if (keywordLoading && !keywordApiData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">키워드 데이터를 불러오는 중...</Text>
          </View>
        </Layout>
      );
    }

    if (keywordError && !keywordApiData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-red-600">키워드 데이터를 불러오는데 실패했습니다.</Text>
          </View>
        </Layout>
      );
    }
  }

  // 내역 탭에서만 로딩/에러 상태 표시 (캐시된 데이터가 없을 때만)
  if (activeTab === 'history') {
    if (historyLoading && !historyApiData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">내역 데이터를 불러오는 중...</Text>
          </View>
        </Layout>
      );
    }

    if (historyError && !historyApiData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-red-600">내역 데이터를 불러오는데 실패했습니다.</Text>
          </View>
        </Layout>
      );
    }
  }

  // 시간대 탭에서만 로딩/에러 상태 표시 (캐시된 데이터가 없을 때만)
  if (activeTab === 'time') {
    if (timeLoading && !timeApiData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">시간대 데이터를 불러오는 중...</Text>
          </View>
        </Layout>
      );
    }

    if (timeError && !timeApiData) {
      return (
        <Layout showHeader={false}>
          <CustomHeader
            title="내 소비패턴 분석"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-red-600">시간대 데이터를 불러오는데 실패했습니다.</Text>
          </View>
        </Layout>
      );
    }
  }

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="내 소비패턴 분석"
        onBackPress={() => navigation.goBack()}
      />
        {/* 탭 */}
        <MyPatternTab
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

      <ScrollView className="flex-1 bg-white">

        {/* 탭별 콘텐츠 */}
        {activeTab === 'category' ? (
          <CategoryTabContent 
            categoryData={categoryData} 
            formatAmount={formatAmount}
            additionalInfoData={additionalInfoData}
            selectedPeriod={categoryPeriod}
            onPeriodChange={setCategoryPeriod}
          />
        ) : activeTab === 'month' ? (
          <MonthTabContent 
            monthData={monthData}
            monthlyApiData={monthlyData}
            formatAmount={formatAmount}
            additionalInfoData={additionalInfoData}
          />
        ) : activeTab === 'keyword' ? (
          <KeywordTabContent 
            keywordApiData={keywordApiData}
            additionalInfoData={additionalInfoData}
          />
        ) : activeTab === 'history' ? (
          <HistoryTabContent 
            categoryData={categoryData}
            historyApiData={historyApiData}
            formatAmount={formatAmount}
            historyData={historyData}
          />
        ) : activeTab === 'time' && (
          <TimeTabContent 
            timeData={timeData}
            timeApiData={timeApiData}
            additionalInfoData={additionalInfoData}
          />
        )}

        {/* 추가사항 - 카테고리, 월별, 키워드, 내역, 시간대 탭 제외 */}
        {activeTab !== 'category' && activeTab !== 'month' && activeTab !== 'keyword' && activeTab !== 'history' && activeTab !== 'time' && (
          <AdditionalInfo 
            activeTab={activeTab}
            additionalInfoData={additionalInfoData}
            categoryChartData={categoryData}
          />
        )}
      </ScrollView>
    </Layout>
  );
}