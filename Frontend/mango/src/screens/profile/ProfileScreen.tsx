import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/common/Layout';

interface ProfileScreenProps {
  onLogout?: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const navigation = useNavigation<any>();

  const handleProfileEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleMyPattern = () => {
    navigation.navigate('MyPattern');
  };

  return (
    <Layout headerTitle="mango" onLogout={onLogout}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.editButton} onPress={handleProfileEdit}>
          <Text style={styles.editButtonText}>프로필 수정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.patternButton}
          onPress={handleMyPattern}
        >
          <Text style={styles.patternButtonText}>소비 패턴 분석</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  patternButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  patternButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
