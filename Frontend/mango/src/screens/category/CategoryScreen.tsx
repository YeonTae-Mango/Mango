import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryCard from '../../components/category/CategoryCard';
import Layout from '../../components/common/Layout';

interface CategoryScreenProps {
  onLogout?: () => void;
}

export default function CategoryScreen({ onLogout }: CategoryScreenProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleCardPress = (categoryTitle: string) => {
    navigation.navigate('CategorySwipe', { categoryTitle });
  };

  const categories = [
    {
      id: 1,
      title: '핫플형',
      icon: require('../../../assets/images/categoryicon/hotplace.png'),
      description: '핫플형에 대한 설명을 작성해주세요',
      color: '#FCBAD3',
    },
    {
      id: 2,
      title: '쇼핑형',
      icon: require('../../../assets/images/categoryicon/shopping.png'),
      description: '쇼핑형에 대한 설명을 작성해주세요',
      color: '#A3DC9A',
    },
    {
      id: 3,
      title: '여행가형',
      icon: require('../../../assets/images/categoryicon/traveler.png'),
      description: '여행가형에 대한 설명을 작성해주세요',
      color: '#A8D8EA',
    },
    {
      id: 4,
      title: '뷰티형',
      icon: require('../../../assets/images/categoryicon/beauty.png'),
      description: '뷰티형에 대한 설명을 작성해주세요',
      color: '#AA96DA',
    },
    {
      id: 5,
      title: '자기계발형',
      icon: require('../../../assets/images/categoryicon/improvement.png'),
      description: '자기계발형에 대한 설명을 작성해주세요',
      color: '#FCBAD3',
    },
    {
      id: 6,
      title: '스포츠형',
      icon: require('../../../assets/images/categoryicon/sport.png'),
      description: '스포츠형에 대한 설명을 작성해주세요',
      color: '#A3DC9A',
    },
    {
      id: 7,
      title: '예술가형',
      icon: require('../../../assets/images/categoryicon/artist.png'),
      description: '예술가형에 대한 설명을 작성해주세요',
      color: '#A8D8EA',
    },
    {
      id: 8,
      title: '집돌이형',
      icon: require('../../../assets/images/categoryicon/homebody.png'),
      description: '집돌이형에 대한 설명을 작성해주세요',
      color: '#AA96DA',
    },
  ];

  return (
    <Layout onLogout={onLogout}>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Math.max(insets.bottom, 80) + 60, // 탭바 높이를 더 크게 계산
        }}
      >
        <View className="p-4">
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
