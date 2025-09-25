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
import { formatTime } from '../../utils/timeFormat';

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
      time: room.lastMessageTime ? formatTime(room.lastMessageTime) : '',
      unreadCount: room.unreadCount || 0,
      isBlocked: room.isBlocked || false,
    };
  });
};

interface ChatListScreenProps {
  onLogout: () => void;
}

export default function ChatListScreen({ onLogout }: ChatListScreenProps) {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated } = useAuthStore();

  console.log('🏠 ChatListScreen 컴포넌트 렌더링됨');

  // 채팅방 목록 실시간 업데이트를 위한 상태
  const [realTimeChatRooms, setRealTimeChatRooms] = useState<ChatRoom[]>([]);

  // 실제 채팅방 목록 API 호출
  const {
    data: chatRoomsData,
    isLoading,
    error,
    refetch: refetchChatRooms,
  } = useQuery({
    queryKey: ['chatRooms', user?.id],
    queryFn: getChatRooms,
    enabled: isAuthenticated && !!user?.id,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지 (불필요한 API 호출 방지)
    refetchOnWindowFocus: true,
    // refetchInterval 제거 - 실시간 업데이트로 대체
  });

  // 개인 알림 콜백 함수 - 채팅방 목록 실시간 업데이트
  const handlePersonalNotification = useCallback(
    (notification: ChatNotificationDTO) => {
      console.log('\n🚨🚨 CHATLIST - 백엔드 unreadCount 확인 🚨🚨🚨');
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
          console.log('🔄 채팅방 목록 새로고침 실행...');
          refetchChatRooms(); // ✅ 새로운 채팅방 생성 시 즉시 목록 새로고침
        }

        return updatedRooms;
      });
    },
    [refetchChatRooms]
  );

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

  // 실제 데이터를 변환해서 사용
  const baseChatRooms = chatRoomsData
    ? transformChatRoomData(chatRoomsData)
    : [];

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

  // 채팅방이 없을 때
  if (chatRooms.length === 0) {
    return (
      <Layout onLogout={onLogout} showBottomSafeArea={false}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-subheading-bold text-center">
            <Text className="text-subheading-bold text-center text-mango-red">
              망
            </Text>
            설이지 말
            <Text className="text-subheading-bold text-center text-mango-red">
              고
            </Text>
            , 지금 당장{' '}
            <Text className="text-subheading-bold text-center text-mango-red">
              망고
            </Text>
            하세요! 🥭✨
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
