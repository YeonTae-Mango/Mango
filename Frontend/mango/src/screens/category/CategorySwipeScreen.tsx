import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface CategorySwipeScreenProps {
  onLogout?: () => void;
}

export default function CategorySwipeScreen({
  onLogout,
}: CategorySwipeScreenProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryTitle } = route.params as { categoryTitle: string };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{categoryTitle} 스와이프</Text>
        <Text style={styles.subtitle}>
          {categoryTitle} 카테고리의 스와이프 화면입니다
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
