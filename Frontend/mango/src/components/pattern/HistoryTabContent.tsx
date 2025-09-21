import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface HistoryTabContentProps {
  categoryData: Array<{
    name: string;
    percentage: number;
    amount: number;
    color: string;
  }>;
  formatAmount: (amount: number) => string;
  historyData: {
    totalAmount: number;
    increaseRate: number;
  };
}

export default function HistoryTabContent({ categoryData, formatAmount, historyData }: HistoryTabContentProps) {
  const navigation = useNavigation<any>();

  return (
    <View className="px-4 pb-8">
      {/* 총 누적 소비액 */}
      <View className="bg-gray rounded-2xl p-4 mb-6">
        <Text className="text-body-large-semibold text-text-primary mb-2 text-center">
          총 누적 소비액
        </Text>
        <Text className="text-heading-bold text-text-primary mb-2 text-center">
          {formatAmount(historyData.totalAmount)}
        </Text>
        <Text className="text-body-medium-semibold text-green-500 text-center">
          + 전월 대비 {historyData.increaseRate}% 증가
        </Text>
      </View>

      {/* 내역 목록 */}
      <View className="space-y-3">
        {categoryData.map((category, index) => (
          <TouchableOpacity 
            key={index} 
            className="flex-row items-center justify-between mb-2 py-2"
            onPress={() => navigation.navigate('CategoryDetail', {
              categoryName: category.name,
              totalAmount: category.amount,
              percentage: category.percentage
            })}
          >
            <View className="flex-row items-center">
              <View className={`w-4 h-4 rounded-full ${category.color} mr-3`} />
              <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                {category.name}
              </Text>
              <Text className="text-body-large-regular text-text-secondary ml-3">
                {category.percentage}%
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-body-large-regular text-text-primary" style={{ fontWeight: '700' }}>
                {formatAmount(category.amount)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" className="ml-2" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
