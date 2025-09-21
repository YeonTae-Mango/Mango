import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';

export default function CategoryDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoryName, totalAmount, percentage } = route.params;

  // 더미 데이터 - 실제로는 API에서 가져올 데이터
  const expenseData = [
    { date: '9월 6일', item: '맛보치킨', amount: 22130 },
    { date: '9월 3일', item: '맛집피자라던데', amount: 113130 },
    { date: '9월 2일', item: '진배족발', amount: 73130 },
    { date: '9월 1일', item: '노브랜드버거', amount: 13130 },
  ];

  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + '원';
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title={categoryName}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 총 소비액 섹션 */}
        <View className="px-6 pb-8">
          <View className="bg-gray rounded-2xl p-4">
            <Text className="text-body-large-semibold text-text-primary mb-2 text-center">
              {categoryName} 총 소비액
            </Text>
            <Text className="text-heading-bold text-text-primary mb-2 text-center">
              {formatAmount(totalAmount)}
            </Text>
            <Text className="text-body-medium-semibold text-green-500 text-center">
              + 전월 대비 10% 증가
            </Text>
          </View>
        </View>

        {/* 상세 내역 목록 */}
        <View className="px-6 pb-8">
          <View className="space-y-3">
            {expenseData.map((expense, index) => (
              <View key={index} className="flex-row items-center justify-between py-3">
                <View className="flex-1">
                  <Text className="text-body-large-regular text-text-primary mb-1">
                    {expense.date}
                  </Text>
                  <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                    {expense.item}
                  </Text>
                </View>
                <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                  {formatAmount(expense.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
