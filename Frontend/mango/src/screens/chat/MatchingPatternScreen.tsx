import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MatchingPatternScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName } = route.params as { userName: string };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 커스텀 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>소비패턴 궁합</Text>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>{userName}님과의 소비패턴 궁합</Text>
        <View style={styles.compatibilityScore}>
          <Text style={styles.scoreText}>85%</Text>
          <Text style={styles.scoreLabel}>궁합 점수</Text>
        </View>
        <Text style={styles.description}>
          비슷한 소비 패턴을 가지고 계시네요! 특히 문화/여가 활동에서 높은
          유사성을 보입니다.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  compatibilityScore: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
