import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MyPatternTabProps {
  activeTab: 'category' | 'month' | 'keyword' | 'time' | 'history';
  onTabChange: (tab: 'category' | 'month' | 'keyword' | 'time' | 'history') => void;
}

export default function MyPatternTab({ activeTab, onTabChange }: MyPatternTabProps) {
  const tabs = [
    { key: 'category', label: '카테고리' },
    { key: 'month', label: '월별' },
    { key: 'keyword', label: '키워드' },
    { key: 'time', label: '시간대' },
    { key: 'history', label: '내역' },
  ];

  return (
    <View className="px-4 pt-4">
      <View className="flex-row bg-white">
        {tabs.map((tab, index) => (
          <TouchableOpacity 
            key={tab.key}
            className="flex-1 relative py-3"
            onPress={() => onTabChange(tab.key as typeof activeTab)}
          >
            <Text className={`text-center text-subheading-bold ${
              activeTab === tab.key ? 'text-mango-red' : 'text-text-primary'
            }`}>
              {tab.label}
            </Text>
            <View className={`absolute bottom-0 left-0 right-0 h-1 ${
              index === 0 ? 'rounded-l-md' : index === tabs.length - 1 ? 'rounded-r-md' : ''
            } ${activeTab === tab.key ? 'bg-mango-red' : 'bg-stroke'}`} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
