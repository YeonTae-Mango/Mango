import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/common/Layout';

interface CategoryScreenProps {
  onLogout?: () => void;
}

export default function CategoryScreen({ onLogout }: CategoryScreenProps) {
  const navigation = useNavigation<any>();

  const handleCardPress = (categoryTitle: string) => {
    navigation.navigate('CategorySwipe', { categoryTitle });
  };

  const categories = [
    {
      id: 1,
      title: '맛집',
      description: '인기 맛집을 찾아보세요',
      color: '#FF6B6B',
    },
    { id: 2, title: '카페', description: '분위기 좋은 카페', color: '#4ECDC4' },
    { id: 3, title: '쇼핑', description: '쇼핑 핫플레이스', color: '#45B7D1' },
    { id: 4, title: '문화', description: '문화생활 공간', color: '#96CEB4' },
  ];

  return (
    <Layout headerTitle="mango" onLogout={onLogout}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.card, { backgroundColor: category.color }]}
              onPress={() => handleCardPress(category.title)}
            >
              <Text style={styles.cardTitle}>{category.title}</Text>
              <Text style={styles.cardDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
});
