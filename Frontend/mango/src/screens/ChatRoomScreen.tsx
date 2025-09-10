import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Layout from '../components/common/Layout';

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
};

const mockMessages: Message[] = [
  { id: '1', text: '안녕하세요!', sender: 'other', time: '14:30' },
  {
    id: '2',
    text: '네, 안녕하세요! 오늘 날씨가 좋네요.',
    sender: 'me',
    time: '14:31',
  },
  {
    id: '3',
    text: '정말 그러네요. 산책하기 좋은 날이에요.',
    sender: 'other',
    time: '14:32',
  },
];

export default function ChatRoomScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userName } = route.params as {
    userName: string;
    chatRoomId: string;
  };

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'me',
        time: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'me' ? styles.myMessageText : styles.otherMessageText,
        ]}
      >
        {item.text}
      </Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <Layout headerTitle={userName}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>채팅 목록</Text>
        </TouchableOpacity>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요..."
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    fontSize: 16,
  },
  myMessageText: {
    backgroundColor: '#FF6B6B',
    color: '#fff',
  },
  otherMessageText: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
