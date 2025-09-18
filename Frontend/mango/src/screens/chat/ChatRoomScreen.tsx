import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatDateSeparator from '../../components/chat/ChatDateSeparator';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatInputPanel from '../../components/chat/ChatInputPanel';
import ChatMenuModal from '../../components/chat/ChatMenuModal';
import ChatMessage from '../../components/chat/ChatMessage';

// 메시지 타입 정의
interface Message {
  id: string;
  text: string;
  isMyMessage: boolean;
  time: string;
  isRead: boolean;
  date?: string; // 날짜 구분자용
  isDateSeparator?: boolean;
}

export default function ChatRoomScreen() {
  // 네비게이션 및 라우트 훅
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName } = route.params as {
    userName: string;
    chatRoomId: string;
  };
  // 메뉴 모달 상태
  const [showMenuModal, setShowMenuModal] = useState(false);
  // FlatList 참조
  const flatListRef = useRef<FlatList>(null);

  // 메시지 목록 상태
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'date-1',
      text: '',
      isMyMessage: false,
      time: '',
      isRead: false,
      date: '2024년 1월 15일 월요일',
      isDateSeparator: true,
    },
    {
      id: '1',
      text: '안녕하세요! 반갑습니다 😊',
      isMyMessage: false,
      time: '오후 2:30',
      isRead: true,
    },
    {
      id: '2',
      text: '네, 안녕하세요! 저도 반갑습니다',
      isMyMessage: true,
      time: '오후 2:31',
      isRead: true,
    },
    {
      id: '3',
      text: '오늘 날씨가 정말 좋네요~',
      isMyMessage: false,
      time: '오후 2:32',
      isRead: true,
    },
    {
      id: '4',
      text: '맞아요! 산책하기 딱 좋은 날씨예요',
      isMyMessage: true,
      time: '오후 2:33',
      isRead: true,
    },
    {
      id: '5',
      text: '혹시 시간 되실 때 커피 한 잔 어떠세요?',
      isMyMessage: false,
      time: '오후 2:35',
      isRead: false,
    },
  ]);

  const handleProfilePress = () => {
    navigation.navigate('ProfileDetail', { userName });
  };

  const handleMenuPress = () => {
    setShowMenuModal(true);
  };

  const handleReportChat = () => {
    Alert.alert('매치 취소', '정말로 상대방과의 매치를 취소하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        style: 'destructive',
        onPress: () => {
          // 매치 취소 로직
          navigation.goBack();
        },
      },
    ]);
  };

  const handleBlockUser = () => {
    Alert.alert('사용자 차단', '이 사용자를 차단하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '차단',
        style: 'destructive',
        onPress: () => {
          // 차단 로직
          Alert.alert('알림', '사용자가 차단되었습니다.');
        },
      },
    ]);
  };

  const handleSendMessage = (message: string) => {
    // 새 메시지 추가
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isMyMessage: true,
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      isRead: false,
    };

    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      // 새 메시지 추가 후 자동 스크롤
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return newMessages;
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.isDateSeparator) {
      return <ChatDateSeparator date={item.date!} />;
    }

    return (
      <ChatMessage
        message={item.text}
        isMyMessage={item.isMyMessage}
        time={item.time}
        isRead={item.isRead}
      />
    );
  };

  const handleReportUser = () => {
    Alert.alert('사용자 신고', '이 사용자를 신고하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '신고',
        onPress: () => {
          // 신고 로직
          Alert.alert('알림', '신고가 접수되었습니다.');
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <ChatHeader
        userName={userName}
        showUserInfo={true}
        showMenu={true}
        onBackPress={() => navigation.goBack()}
        onProfilePress={handleProfilePress}
        onMenuPress={handleMenuPress}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          // contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />

        <ChatInputPanel
          onSendMessage={handleSendMessage}
          placeholder="메시지 보내기..."
        />
      </KeyboardAvoidingView>

      <ChatMenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        onReportChat={handleReportChat}
        onBlockUser={handleBlockUser}
        onReportUser={handleReportUser}
      />

      {/* 하단 SafeArea - 갤럭시 네비게이션 바와 겹치지 않도록 */}
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }} />
    </View>
  );
}
