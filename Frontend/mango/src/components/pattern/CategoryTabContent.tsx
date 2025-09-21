import React from 'react';
import { Text, View } from 'react-native';

interface CategoryTabContentProps {
  categoryData: Array<{
    name: string;
    percentage: number;
    amount: number;
    color: string;
  }>;
  formatAmount: (amount: number) => string;
}

export default function CategoryTabContent({ categoryData, formatAmount }: CategoryTabContentProps) {
  return (
    <View className="px-4 pb-3">
      <View className="space-y-3">
        {categoryData.map((category, index) => (
          <View key={index} className="flex-row items-center justify-between mb-2">
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
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
