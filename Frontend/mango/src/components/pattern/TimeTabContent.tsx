import React from 'react';
import { Text, View } from 'react-native';

interface TimeTabContentProps {
  timeData: Array<{
    time: string;
    percentage: number;
    color: string;
  }>;
}

export default function TimeTabContent({ timeData }: TimeTabContentProps) {
  return (
    <View className="px-4 pb-2">
      <View className="flex-row justify-between mb-4">
        {timeData.map((time, index) => (
          <View key={index} className="items-center">
            <Text className="text-body-medium-regular text-text-secondary mb-2">{time.time}</Text>
            <View className={`${time.color} rounded-xl w-16 py-2 items-center`}>
              <Text className={`text-body-large-semibold ${
                time.color === 'bg-gray' ? 'text-text-primary' : 'text-white'
              }`}>
                {time.percentage}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
