import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getChatMessages, getChatRoom } from '../../api/chat';
import ChatDateSeparator from '../../components/chat/ChatDateSeparator';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatInputPanel from '../../components/chat/ChatInputPanel';
import ChatMenuModal from '../../components/chat/ChatMenuModal';
import ChatMessage from '../../components/chat/ChatMessage';
import chatService from '../../services/chatService';
import { useAuthStore } from '../../store/authStore';

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
  const { user } = useAuthStore();

  const { userName, chatRoomId } = route.params as {
    userName: string;
    chatRoomId: string;
  };

  // 채팅방 정보 조회
  const {
    data: chatRoomData,
    isLoading: roomLoading,
    error: roomError,
  } = useQuery({
    queryKey: ['chatRoom', chatRoomId],
    queryFn: () => getChatRoom(parseInt(chatRoomId)),
    enabled: !!chatRoomId,
  });

  // 채팅 메시지 조회
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => getChatMessages(parseInt(chatRoomId), 0, 50),
    enabled: !!chatRoomId,
  });

  // 메뉴 모달 상태
  const [showMenuModal, setShowMenuModal] = useState(false);
  // FlatList 참조
  const flatListRef = useRef<FlatList>(null);
  // WebSocket 연결 상태
  const [isConnected, setIsConnected] = useState(false);

  // API에서 받은 메시지 데이터를 화면용 데이터로 변환
  const transformMessagesData = useCallback(
    (apiMessages: any[]): Message[] => {
      if (!apiMessages || !user) return [];

      return apiMessages.map(msg => ({
        id: msg.id.toString(),
        text: msg.content || '',
        isMyMessage: msg.senderId === user.id,
        time: new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        isRead: msg.isRead,
      }));
    },
    [user]
  );

  // 실제 메시지 데이터 + 로컬 메시지 상태
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // API에서 받은 메시지와 로컬 메시지를 합침
  const apiMessages =
    messagesData && (messagesData as any)?.content
      ? transformMessagesData((messagesData as any).content)
      : [];
  const allMessages = [...apiMessages, ...localMessages].sort(
    (a, b) => parseInt(a.id) - parseInt(b.id)
  );

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

  // WebSocket 연결 및 메시지 수신 설정
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        console.log('🔌 ChatRoom에서 WebSocket 연결 시작...');

        // 현재 연결 상태 확인
        const currentStatus = chatService.getConnectionStatus();
        console.log('🔍 현재 WebSocket 상태:', currentStatus);

        // WebSocket 연결
        await chatService.connect();

        // 연결 후 상태 재확인
        const afterStatus = chatService.getConnectionStatus();
        console.log('🔍 연결 후 WebSocket 상태:', afterStatus);

        setIsConnected(afterStatus.connected);

        // 채팅방 구독
        if (chatRoomId) {
          chatService.subscribeToRoom(
            parseInt(chatRoomId),
            (newMessage: any) => {
              // 새 메시지 수신 시 로컬 상태에 추가
              const transformedMessage: Message = {
                id: newMessage.id.toString(),
                text: newMessage.content || '',
                isMyMessage: newMessage.senderId === user?.id,
                time: new Date(newMessage.createdAt).toLocaleTimeString(
                  'ko-KR',
                  {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }
                ),
                isRead: newMessage.isRead,
              };

              setLocalMessages(prev => [...prev, transformedMessage]);

              // 새 메시지 수신 후 자동 스크롤
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          );
        }
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
        setIsConnected(false);
      }
    };

    setupWebSocket();

    return () => {
      // 컴포넌트 언마운트 시 구독 해제
      if (chatRoomId) {
        chatService.unsubscribeFromRoom(parseInt(chatRoomId));
      }
    };
  }, [chatRoomId, user?.id]);

  const handleSendMessage = async (message: string) => {
    if (!isConnected || !chatRoomId) {
      Alert.alert('오류', '채팅 서버에 연결되지 않았습니다.');
      return;
    }

    try {
      // WebSocket으로 메시지 전송
      chatService.sendMessage(parseInt(chatRoomId), message, 'TEXT');

      // 자동 스크롤
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      Alert.alert('오류', '메시지 전송에 실패했습니다.');
    }
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

  // 로딩 상태
  if (roomLoading || messagesLoading) {
    return (
      <View className="flex-1 bg-white">
        <ChatHeader
          userName={userName || '로딩중...'}
          showUserInfo={false}
          showMenu={false}
          onBackPress={() => navigation.goBack()}
          onProfilePress={() => {}}
          onMenuPress={() => {}}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="mt-4 text-gray-600">채팅방을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 에러 상태
  if (roomError || messagesError) {
    return (
      <View className="flex-1 bg-white">
        <ChatHeader
          userName={userName || '오류'}
          showUserInfo={false}
          showMenu={false}
          onBackPress={() => navigation.goBack()}
          onProfilePress={() => {}}
          onMenuPress={() => {}}
        />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center mb-4">
            채팅방을 불러오는 중 오류가 발생했습니다.
          </Text>
          <Text className="text-gray-600 text-center">
            {roomError?.message ||
              messagesError?.message ||
              '알 수 없는 오류가 발생했습니다.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ChatHeader
        userName={(chatRoomData as any)?.otherUser?.nickname || userName}
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
          data={allMessages}
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
