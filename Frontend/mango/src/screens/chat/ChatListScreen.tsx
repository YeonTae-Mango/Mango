import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/common/Layout';

interface ChatListScreenProps {
  onLogout: () => void;
}

export default function ChatListScreen({ onLogout }: ChatListScreenProps) {
  const navigation = useNavigation<any>();

  const handleChatPress = (chatRoomId: string, userName: string) => {
    navigation.navigate('ChatRoom', {
      chatRoomId,
      userName,
    });
  };

  return (
    <Layout headerTitle="mango" onLogout={onLogout}>
      <View style={styles.container}>
        {/* 간단한 채팅방 하나 */}
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => handleChatPress('1', '홍길동')}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>홍</Text>
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.userName}>홍길동</Text>
            <Text style={styles.lastMessage}>
              안녕하세요! 오늘 날씨가 좋네요.
            </Text>
          </View>
          <Text style={styles.time}>오후 2:30</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});
