import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryCard from '../../components/category/CategoryCard';
import Layout from '../../components/common/Layout';
import { CATEGORY_LIST } from '../../constants/category';

interface CategoryScreenProps {
  onLogout?: () => void;
}

export default function CategoryScreen({ onLogout }: CategoryScreenProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleCardPress = (categoryTitle: string) => {
    // Category 탭 내부의 Stack Navigator로 이동
    navigation.navigate('CategorySwipe', { categoryTitle });
  };

  // category.ts의 데이터를 사용하여 카테고리 정보 생성
  const categories = CATEGORY_LIST.map((category, index) => ({
    id: index + 1,
    title: `${category.emoji} ${category.name}`,
    description: category.shortDescription,
    backgroundImage: category.image,
    color: category.colors.primary,
  }));

  return (
    <Layout onLogout={onLogout} showBottomSafeArea={false}>
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          // paddingBottom: Math.max(insets.bottom, 80), // 탭바 높이를 더 크게 계산
        }}
      >
        <View className="p-4">
          {/* 헤더 텍스트 */}
          <View className="mb-6 ml-2">
            <Text className="text-subheading-bold text-dark mb-2">
              카테고리
            </Text>
            <Text className="text-body-large-regular text-text-primary">
              소비패턴 유형별 새로운 사람들을 만나보세요!
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={handleCardPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
