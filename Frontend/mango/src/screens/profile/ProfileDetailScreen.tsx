import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ChatHeader from '../../components/chat/ChatHeader';

export default function ProfileDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName, fromScreen } = route.params as {
    userName: string;
    fromScreen?: string;
  };

  const handleMatchingPattern = () => {
    navigation.navigate('MatchingPattern', { userName });
  };

  const showMatchingButton = fromScreen !== 'Mango';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader
        title={`${userName}님의 프로필`}
        showUserInfo={false}
        showMenu={false}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName[0]}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userStatus}>핫플헌터</Text>
        </View>

        {showMatchingButton && (
          <TouchableOpacity
            style={styles.matchingButton}
            onPress={handleMatchingPattern}
          >
            <Text style={styles.matchingButtonText}>소비패턴 궁합 보기</Text>
          </TouchableOpacity>
        )}
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
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userStatus: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  matchingButton: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },
  matchingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
