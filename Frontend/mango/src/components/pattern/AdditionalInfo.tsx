import React from 'react';
import { Text, View } from 'react-native';

interface AdditionalInfoProps {
  activeTab: 'category' | 'month' | 'keyword' | 'time' | 'history';
  additionalInfoData: {
    month: {
      increaseRate: number;
      peakMonth: string;
    };
    keyword: Array<{
      keyword: string;
      description: string;
      color: string;
    }>;
    time: {
      peakTime: string;
    };
    category: {
      topCategories: Array<{
        name: string;
        percentage: number;
      }>;
    };
  };
}

export default function AdditionalInfo({ activeTab, additionalInfoData }: AdditionalInfoProps) {
  if (activeTab === 'history') {
    return null; // 내역 탭에서는 추가사항 표시하지 않음
  }

  return (
    <View className="px-4 mb-8">
      <View className="bg-gray rounded-2xl p-4">
        {activeTab === 'month' ? (
          <>
            <Text className="text-body-large-regular text-text-primary text-center mb-2">
              {additionalInfoData.month.peakMonth} 소비액은 전월 대비 
              <Text className='font-bold'>
               {' '}{additionalInfoData.month.increaseRate}% 증가
              </Text>     
              했어요!
            </Text>
              <Text className="text-body-large-regular text-text-primary text-center">
                최근 6개월간 
                <Text className='font-bold'>
                 {' '}{additionalInfoData.month.peakMonth}에 가장 많은 소비
                </Text>
                를 했어요!
              </Text>
          </>
        ) : activeTab === 'keyword' ? (
          <View className="space-y-4">
            {additionalInfoData.keyword.map((keyword, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View className={`${keyword.color} rounded-full px-3 py-1 mr-3`}>
                  <Text className="text-body-medium-semibold text-white">
                    {keyword.keyword}
                  </Text>
                </View>
                <Text className="text-body-large-regular text-text-primary flex-1" style={{ fontWeight: '700' }}>
                  : {keyword.description}
                </Text>
              </View>
            ))}
          </View>
        ) : activeTab === 'time' ? (
          <>
            <Text className="text-body-large-regular text-text-primary text-center mb-2">
              나는 
              <Text className='font-bold'>
                {' '}{additionalInfoData.time.peakTime}
              </Text>
              에
            </Text>
            <Text className="text-body-large-regular text-text-primary text-center">
             가장 많은 소비를 했어요!
            </Text>
          </>
        ) : (
          <>
            <Text className="text-body-large-regular text-text-primary text-center mb-2">
              {additionalInfoData.category.topCategories[0].name}에 
              <Text className='font-bold'>
                {' '}{additionalInfoData.category.topCategories[0].percentage}%
              </Text>
              , {additionalInfoData.category.topCategories[1].name}에 
              <Text className='font-bold'>
                {' '}{additionalInfoData.category.topCategories[1].percentage}%
              </Text>
              로
            </Text>
            <Text className="text-body-large-regular text-text-primary text-center">
              가장 많은 소비를 했어요!
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
