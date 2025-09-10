import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Layout from '../components/common/Layout';

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
};

const mockChatList: ChatItem[] = [
  { id: '1', name: '홍길동', lastMessage: '안녕하세요!', time: '오후 2:30' },
];

export default function ChatListScreen() {
  const navigation = useNavigation<any>();

  const handleChatPress = (chatRoomId: string, userName: string) => {
    navigation.navigate('ChatRoom', {
      chatRoomId,
      userName,
    });
  };

  const renderChatItem: ListRenderItem<ChatItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id, item.name)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <Layout headerTitle="mango">
      <View style={styles.container}>
        <FlatList
          data={mockChatList}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
