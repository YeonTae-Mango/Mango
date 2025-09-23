import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getChatRooms } from '../../api/chat';
import ChatItem from '../../components/chat/ChatItem';
import Layout from '../../components/common/Layout';
import chatService from '../../services/chatService';
import { useAuthStore } from '../../store/authStore';
import { ChatNotificationDTO } from '../../types/chat';

interface ChatRoom {
  chatRoomId: string;
  userName: string;
  userId?: number;
  profileImageUrl?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isBlocked?: boolean;
}

// API에서 받은 채팅방 데이터를 화면용 데이터로 변환
const transformChatRoomData = (apiData: any[]): ChatRoom[] => {
  return apiData.map(room => {
    console.log('🔍 채팅방 데이터 변환:', room);
    return {
      chatRoomId: room.id.toString(),
      userName:
        room.otherUserNickname ||
        room.otherUser?.nickname ||
        '알 수 없는 사용자',
      userId: room.otherUserId || room.otherUser?.userId,
      profileImageUrl:
        room.otherUserProfileImage || room.otherUser?.profilePhotoUrl,
      lastMessage: room.lastMessage || '먼저 채팅을 보내보세요!',
      time: room.lastMessageTime
        ? new Date(room.lastMessageTime).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : '',
      unreadCount: room.unreadCount || 0,
      isBlocked: room.isBlocked || false,
    };
  });
};

interface ChatListScreenProps {
  onLogout: () => void;
}

// 임시 데이터
const generateMockData = (page: number): ChatRoom[] => {
  const mockUsers = [
    '홍사운드',
    '김철수',
    '이영희',
    '박민수',
    '최지영',
    '정우진',
    '강소영',
    '임태현',
    '윤서연',
    '조민호',
  ];

  const mockMessages = [
    '안녕하세요! 오늘 날씨가 좋네요. 안녕하세요! 오늘 날씨가 좋네',
    '네, 맞아요! 산책하기 좋은 날씨인 것 같아요.',
    '오늘 점심 뭐 드셨나요?',
    '혹시 시간 되시면 커피 한 잔 어떠세요?',
    '감사합니다! 좋은 하루 되세요.',
    '네, 알겠습니다. 확인해보겠습니다.',
    '정말 재미있는 영화였어요!',
    '다음에 또 만나요~',
    '좋은 정보 감사합니다.',
    '네, 잘 부탁드립니다!',
  ];

  return Array.from({ length: 10 }, (_, index) => ({
    chatRoomId: `${page * 10 + index + 1}`,
    userName: mockUsers[index],
    lastMessage: mockMessages[index],
    time: `오후 ${2 + (index % 6)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    unreadCount: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : 0, // 70% 확률로 1-10개의 안 읽은 메시지
  }));
};

export default function ChatListScreen({ onLogout }: ChatListScreenProps) {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated } = useAuthStore();

  console.log('🏠 ChatListScreen 컴포넌트 렌더링됨');

  // 채팅방 목록 실시간 업데이트를 위한 상태
  const [realTimeChatRooms, setRealTimeChatRooms] = useState<ChatRoom[]>([]);

  // 개인 알림 콜백 함수 - 채팅방 목록 실시간 업데이트
  const handlePersonalNotification = useCallback(
    (notification: ChatNotificationDTO) => {
      console.log('\n�🚨🚨 CHATLIST - 백엔드 unreadCount 확인 🚨🚨🚨');
      console.log('📊 unreadCount 값:', notification.unreadCount);
      console.log('🔍 전체 notification:', notification);
      console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n');

      // 알림 데이터에서 필요한 필드 추출
      const { chatRoomId, lastMessage, messageType, timestamp, unreadCount } =
        notification;

      // 채팅방 목록에서 해당 채팅방 업데이트
      setRealTimeChatRooms(prevRooms => {
        const updatedRooms = [...prevRooms];
        const roomIndex = updatedRooms.findIndex(
          room => room.chatRoomId === chatRoomId.toString()
        );

        if (roomIndex >= 0) {
          // 기존 채팅방 업데이트
          const updatedRoom = {
            ...updatedRooms[roomIndex],
            lastMessage: messageType === 'IMAGE' ? '📷 사진' : lastMessage,
            time: formatTime(timestamp),
            // 🎯 백엔드에서 unreadCount를 주면 사용, 아니면 기존 방식 (+1)
            unreadCount:
              unreadCount !== undefined
                ? unreadCount // ✅ 서버의 정확한 값 사용
                : (updatedRooms[roomIndex].unreadCount || 0) + 1, // 🔴 임시 방식
          };

          console.log('✅ unreadCount 처리 결과:', {
            서버값: unreadCount,
            사용된값: updatedRoom.unreadCount,
            처리방식:
              unreadCount !== undefined ? '서버값 사용' : '클라이언트 +1',
          });

          // 업데이트된 채팅방을 맨 위로 이동
          updatedRooms.splice(roomIndex, 1);
          updatedRooms.unshift(updatedRoom);

          console.log('✅ 기존 채팅방 업데이트:', updatedRoom);
        } else {
          // 새로운 채팅방 감지 - 목록을 다시 불러오기
          console.log('🆕 새로운 채팅방 감지:', chatRoomId);
          // React Query로 목록 새로고침 트리거 (추후 구현)
        }

        return updatedRooms;
      });
    },
    []
  );

  // 시간 포맷 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return '방금';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      // 24시간
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // 화면 포커스시 개인 알림 콜백 등록
  useFocusEffect(
    useCallback(() => {
      console.log('\n� 채팅 화면 진입 - 개인 알림 콜백 등록 🚨');
      console.log('👤 사용자 ID:', user?.id);
      console.log('🔗 chatService 연결상태:', chatService.isConnected);

      if (user?.id && chatService.isConnected) {
        // 개인 알림 콜백 업데이트 (이미 구독되어 있다면 콜백만 교체)
        try {
          console.log('✅ 개인 알림 콜백 등록 시도...');
          chatService.subscribeToPersonalNotifications(
            user.id,
            handlePersonalNotification
          );
          console.log('✅ 개인 알림 콜백 등록 완료!');
        } catch (error) {
          console.log('⚠️ 개인 알림 구독은 이미 되어 있음:', error);
        }
      } else {
        console.log('❌ 콜백 등록 실패 - 사용자ID나 연결상태 확인필요');
      }

      return () => {
        console.log('📱 채팅 화면 벗어남');
        // 개인 알림 구독과 콜백은 유지 (다른 화면에서도 알림이 필요함)
        // chatService.personalNotificationCallback = null; // 제거!
      };
    }, [user?.id, handlePersonalNotification])
  );

  // 실제 채팅방 목록 API 호출
  const {
    data: chatRoomsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chatRooms', user?.id],
    queryFn: getChatRooms,
    enabled: isAuthenticated && !!user?.id,
    staleTime: 0, // 항상 fresh 데이터로 취급
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // 30초마다 자동 새로고침 (백그라운드 업데이트)
  });

  // 임시로 목업 데이터도 유지 (API 없을 경우 대비)
  const [fallbackChatRooms] = useState<ChatRoom[]>(generateMockData(0));

  // 실제 데이터가 있으면 변환해서 사용, 없으면 목업 데이터 사용
  const baseChatRooms = chatRoomsData
    ? transformChatRoomData(chatRoomsData)
    : fallbackChatRooms;

  // 실시간 업데이트된 채팅방 목록 사용 (없으면 기본 목록)
  const chatRooms =
    realTimeChatRooms.length > 0 ? realTimeChatRooms : baseChatRooms;

  // API 데이터가 변경되면 실시간 목록도 업데이트
  useEffect(() => {
    if (chatRoomsData) {
      const transformedRooms = transformChatRoomData(chatRoomsData);
      setRealTimeChatRooms(transformedRooms);
    }
  }, [chatRoomsData]);

  const handleChatPress = (
    chatRoomId: string,
    userName: string,
    userId?: number,
    profileImageUrl?: string
  ) => {
    console.log('🚀 ChatListScreen에서 채팅방으로 이동:', {
      chatRoomId,
      userName,
      userId,
      profileImageUrl,
    });
    navigation.navigate('ChatRoom', {
      chatRoomId,
      userName,
      userId,
      profileImageUrl,
    });
  };

  const loadMoreData = useCallback(async () => {
    // TODO: 추후 페이징 기능 구현
    console.log('페이징 기능은 추후 구현 예정입니다.');
  }, []);

  const renderChatItem = ({ item }: { item: ChatRoom }) => (
    <ChatItem
      chatRoomId={item.chatRoomId}
      userName={item.userName}
      profileImageUrl={item.profileImageUrl}
      lastMessage={item.lastMessage}
      time={item.time}
      unreadCount={item.unreadCount}
      isBlocked={item.isBlocked}
      onPress={(chatRoomId, userName) =>
        handleChatPress(chatRoomId, userName, item.userId, item.profileImageUrl)
      }
    />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator className="py-4" size="small" color="#FF6B6B" />;
  };

  // 로딩 중일 때
  if (isLoading && !chatRoomsData) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="mt-4 text-gray-600">
            채팅방 목록을 불러오는 중...
          </Text>
        </View>
      </Layout>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center mb-4">
            채팅방 목록을 불러오는 중 오류가 발생했습니다.
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            {error?.message || '알 수 없는 오류가 발생했습니다.'}
          </Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout onLogout={onLogout} showBottomSafeArea={false}>
      <FlatList
        data={chatRooms}
        renderItem={renderChatItem}
        keyExtractor={item => item.chatRoomId}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        className="flex-1 bg-white mt-2"
      />
    </Layout>
  );
}
