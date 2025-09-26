import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MatchingPatternTabProps {
  activeTab: 'type' | 'category' | 'keyword' | 'time';
  onTabChange: (tab: 'type' | 'category' | 'keyword' | 'time') => void;
}

export default function MatchingPatternTab({ activeTab, onTabChange }: MatchingPatternTabProps) {
  return (
    <View className="p-2 pt-0">
      <View className="flex-row bg-white">
        {/* 대표유형 탭 */}
        <TouchableOpacity 
          className="flex-1 relative py-4"
          onPress={() => onTabChange('type')}
        >
          <Text className={`text-center text-subheading-bold ${
            activeTab === 'type' ? 'text-mango-red' : 'text-text-primary'
          }`}>
            대표유형
          </Text>
          <View className={`absolute bottom-0 left-0 right-0 h-1 rounded-l-md ${
            activeTab === 'type' ? 'bg-mango-red' : 'bg-stroke'
          }`} />
        </TouchableOpacity>

        {/* 카테고리 탭 */}
        <TouchableOpacity 
          className="flex-1 relative py-4"
          onPress={() => onTabChange('category')}
        >
          <Text className={`text-center text-subheading-bold ${
            activeTab === 'category' ? 'text-mango-red' : 'text-text-primary'
          }`}>
            카테고리
          </Text>
          <View className={`absolute bottom-0 left-0 right-0 h-1 ${
            activeTab === 'category' ? 'bg-mango-red' : 'bg-stroke'
          }`} />
        </TouchableOpacity>

        {/* Top3 키워드 탭 */}
        <TouchableOpacity 
          className="flex-1 relative py-4"
          onPress={() => onTabChange('keyword')}
        >
          <Text className={`text-center text-subheading-bold ${
            activeTab === 'keyword' ? 'text-mango-red' : 'text-text-primary'
          }`}>
            키워드
          </Text>
          <View className={`absolute bottom-0 left-0 right-0 h-1 ${
            activeTab === 'keyword' ? 'bg-mango-red' : 'bg-stroke'
          }`} />
        </TouchableOpacity>

        {/* 시간대 탭 */}
        <TouchableOpacity 
          className="flex-1 relative py-4"
          onPress={() => onTabChange('time')}
        >
          <Text className={`text-center text-subheading-bold ${
            activeTab === 'time' ? 'text-mango-red' : 'text-text-primary'
          }`}>
            시간대
          </Text>
          <View className={`absolute bottom-0 left-0 right-0 h-1 rounded-r-md ${
            activeTab === 'time' ? 'bg-mango-red' : 'bg-stroke'
          }`} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
