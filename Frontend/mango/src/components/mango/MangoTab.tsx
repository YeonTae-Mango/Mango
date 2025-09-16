import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MangoTabProps {
  activeTab: 'received' | 'sent';
  onTabChange: (tab: 'received' | 'sent') => void;
}

export default function MangoTab({ activeTab, onTabChange }: MangoTabProps) {
  return (
    <View className="p-4 pt-0">
      <View className="flex-row bg-white">
        {/* 나를 망고한 사람 탭 */}
        <TouchableOpacity
          className="flex-1 relative py-4"
          onPress={() => onTabChange('received')}
        >
          <Text
            className={`text-center text-subheading-bold ${
              activeTab === 'received' ? 'text-mango-red' : 'text-text-primary'
            }`}
          >
            나를 망고한 사람
          </Text>
          <View
            className={`absolute bottom-0 left-0 right-0 h-1 rounded-l-md ${
              activeTab === 'received' ? 'bg-mango-red' : 'bg-stroke'
            }`}
          />
        </TouchableOpacity>

        {/* 내가 망고한 사람 탭 */}
        <TouchableOpacity
          className="flex-1 relative py-4"
          onPress={() => onTabChange('sent')}
        >
          <Text
            className={`text-center text-subheading-bold ${
              activeTab === 'sent' ? 'text-mango-red' : 'text-text-primary'
            }`}
          >
            내가 망고한 사람
          </Text>
          <View
            className={`absolute bottom-0 left-0 right-0 h-1 rounded-r-md ${
              activeTab === 'sent' ? 'bg-mango-red' : 'bg-stroke'
            }`}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
