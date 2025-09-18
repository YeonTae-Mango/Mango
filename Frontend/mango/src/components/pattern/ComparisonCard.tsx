import React from 'react';
import { Text, View } from 'react-native';

interface ComparisonCardProps {
  activeTab: 'type' | 'category' | 'keyword' | 'time';
  userName: string;
}

export default function ComparisonCard({ activeTab, userName }: ComparisonCardProps) {
  // 탭별 데이터 설정
  const getTabData = () => {
    switch (activeTab) {
      case 'type':
        return {
          myType: { name: '핫플헌터', icon: 'location-outline', color: 'bg-mango-red' },
          otherType: { name: '모험가', icon: 'umbrella-outline', color: 'bg-green-500' },
          message: '유형이 가장 높은 점수를 획득했어요!'
        };
      case 'category':
        return {
          myCategory: { name: '음식', percentage: '32%', color: 'bg-orange-500' },
          otherCategory: { name: '여가/오락', percentage: '27%', color: 'bg-purple-500' },
          message: '카테고리에 사용했어요!'
        };
      case 'keyword':
        return {
          myKeyword: { name: '카페인중독', color: 'bg-mango-red' },
          otherKeyword: { name: '경기관람', color: 'bg-green-500' },
          message: '키워드가 가장 잘 어울려요!'
        };
      case 'time':
        return {
          myType: { name: '오후', icon: 'sunny-outline', color: 'bg-orange-400' },
          otherType: { name: '저녁', icon: 'moon-outline', color: 'bg-indigo-500' },
          message: '시간대에 가장 많이 소비했어요!'
        };
      default:
        return {
          myType: { name: '핫플헌터', icon: 'location-outline', color: 'bg-mango-red' },
          otherType: { name: '모험가', icon: 'umbrella-outline', color: 'bg-green-500' },
          message: '유형이 가장 높은 점수를 획득했어요!'
        };
    }
  };

  const tabData = getTabData();

  return (
    <View className="px-4 mb-6">
      <View className="bg-gray rounded-2xl p-6 shadow-sm">
        {activeTab === 'category' ? (
          /* 카테고리 탭 - 라벨 표시 */
          <View>
            {/* 내 카테고리 */}
            <View className="flex-row items-center justify-center mb-4">
              <Text className="text-body-large-semibold text-text-primary mr-3">
                <Text className="font-bold">
                나
                </Text>
                는 소비의 
                <Text className="font-bold">
                {tabData.myCategory?.percentage}
                </Text>
                를
              </Text>
              <View className={`${tabData.myCategory?.color} rounded-full px-4 py-2`}>
                <Text className="text-body-medium-semibold text-white">
                  {tabData.myCategory?.name}
                </Text>
              </View>
            </View>

            {/* 상대방 카테고리 */}
            <View className="flex-row items-center justify-center mb-4">
              <Text className="text-body-large-semibold text-text-primary mr-3">
              <Text className="font-bold">
              {userName}
                </Text>
                님은 소비의 
                <Text className="font-bold">
                {tabData.otherCategory?.percentage}
                </Text>
                를
              </Text>
              <View className={`${tabData.otherCategory?.color} rounded-full px-4 py-2`}>
                <Text className="text-body-medium-semibold text-white">
                  {tabData.otherCategory?.name}
                </Text>
              </View>
            </View>

            {/* 결과 메시지 */}
            <Text className="text-body-large-regular text-text-primary text-center">
              {tabData.message}
            </Text>
          </View>
        ) : activeTab === 'keyword' ? (
          /* 키워드 탭 - 해시태그 표시 */
          <View>
            {/* 내 키워드 */}
            <View className="flex-row items-center justify-center mb-4">
              <Text className="text-body-large-semibold text-text-primary mr-3">
              <Text className="font-bold">
                나
                </Text>
                는
              </Text>
              <View className={`${tabData.myKeyword?.color} rounded-full px-4 py-2`}>
                <Text className="text-body-medium-semibold text-white">
                  #{tabData.myKeyword?.name}
                </Text>
              </View>
            </View>

            {/* 상대방 키워드 */}
            <View className="flex-row items-center justify-center mb-4">
              <Text className="text-body-large-semibold text-text-primary mr-3">
              <Text className="font-bold">
                {userName}
                </Text>
                님은
              </Text>
              <View className={`${tabData.otherKeyword?.color} rounded-full px-4 py-2`}>
                <Text className="text-body-medium-semibold text-white">
                  #{tabData.otherKeyword?.name}
                </Text>
              </View>
            </View>

            {/* 결과 메시지 */}
            <Text className="text-body-large-regular text-text-primary text-center">
              {tabData.message}
            </Text>
          </View>
        ) : (
          /* 다른 탭들 - 기존 유형 표시 */
          <View>
            {/* 내 유형 */}
            <View className="flex-row items-center justify-center mb-4">
              <Text className="text-body-large-semibold text-text-primary mr-3">
              <Text className="font-bold">
                나
                </Text>
                는
              </Text>
              <View className={`${tabData.myType?.color} rounded-full px-4 py-2 flex-row items-center`}>
                <Text className="text-body-medium-semibold text-white">
                  {tabData.myType?.name}
                </Text>
              </View>
            </View>

            {/* 상대방 유형 */}
            <View className="flex-row items-center justify-center mb-4">
              <Text className="text-body-large-semibold text-text-primary mr-3">
              <Text className="font-bold">
                {userName}
                </Text>
                님은
              </Text>
              <View className={`${tabData.otherType?.color} rounded-full px-4 py-2 flex-row items-center`}>
                <Text className="text-body-medium-semibold text-white">
                  {tabData.otherType?.name}
                </Text>
              </View>
            </View>

            {/* 결과 메시지 */}
            <Text className="text-body-large-regular text-text-primary text-center">
              {tabData.message}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}