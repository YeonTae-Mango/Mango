import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProfileTabProps {
  activeTab: 'edit' | 'preview';
  onTabChange: (tab: 'edit' | 'preview') => void;
}

export default function ProfileTab({ activeTab, onTabChange }: ProfileTabProps) {
  return (
    <View className="p-4 pt-0">
      <View className="flex-row bg-white">
        {/* 수정하기 탭 */}
        <TouchableOpacity
          className="flex-1 relative py-4"
          onPress={() => onTabChange('edit')}
        >
          <Text
            className={`text-center text-subheading-bold ${
              activeTab === 'edit' ? 'text-mango-red' : 'text-text-primary'
            }`}
          >
            수정하기
          </Text>
          <View
            className={`absolute bottom-0 left-0 right-0 h-1 rounded-l-md ${
              activeTab === 'edit' ? 'bg-mango-red' : 'bg-stroke'
            }`}
          />
        </TouchableOpacity>

        {/* 미리보기 탭 */}
        <TouchableOpacity
          className="flex-1 relative py-4"
          onPress={() => onTabChange('preview')}
        >
          <Text
            className={`text-center text-subheading-bold ${
              activeTab === 'preview' ? 'text-mango-red' : 'text-text-primary'
            }`}
          >
            미리보기
          </Text>
          <View
            className={`absolute bottom-0 left-0 right-0 h-1 rounded-r-md ${
              activeTab === 'preview' ? 'bg-mango-red' : 'bg-stroke'
            }`}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
