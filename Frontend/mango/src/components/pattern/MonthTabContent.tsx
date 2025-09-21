import React from 'react';
import { Text, View } from 'react-native';

interface MonthTabContentProps {
  monthData: Array<{
    month: string;
    amount: number;
    color: string;
  }>;
  formatAmount: (amount: number) => string;
}

export default function MonthTabContent({ monthData, formatAmount }: MonthTabContentProps) {
  return (
    <View className="px-4 pb-8">
      <Text className="text-subheading-bold text-text-primary mb-4">
        최근 6개월 누적액
      </Text>
      
      {/* 첫 번째 줄: 4월, 5월, 6월 */}
      <View className="flex-row justify-between mb-4">
        {monthData.slice(0, 3).map((month, index) => (
          <View key={index} className="items-center">
            <Text className="text-body-medium-regular text-text-secondary mb-2">{month.month}</Text>
            <View className={`${month.color} rounded-xl px-4 py-2`}>
              <Text className={`text-body-large-semibold ${
                month.color === 'bg-gray' ? 'text-text-primary' : 'text-white'
              }`}>
                {formatAmount(month.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 두 번째 줄: 7월, 8월, 9월 누적 */}
      <View className="flex-row justify-between mb-4">
        {monthData.slice(3, 6).map((month, index) => (
          <View key={index} className="items-center">
            <Text className="text-body-medium-regular text-text-secondary mb-2">{month.month}</Text>
            <View className={`${month.color} rounded-xl px-4 py-2`}>
              <Text className={`text-body-large-semibold ${
                month.color === 'bg-gray' ? 'text-text-primary' : 'text-white'
              }`}>
                {formatAmount(month.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
