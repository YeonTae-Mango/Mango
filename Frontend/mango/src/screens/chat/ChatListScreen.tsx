import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getChatRooms } from '../../api/chat';
import ChatItem from '../../components/chat/ChatItem';
import Layout from '../../components/common/Layout';

import { useAuthStore } from '../../store/authStore';

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

  // 화면 포커스시 WebSocket 연결 상태만 확인
  useFocusEffect(
    useCallback(() => {
      console.log('📱 채팅 화면 진입 - WebSocket 연결 상태 확인');

      return () => {
        console.log('📱 채팅 화면 벗어남');
        // 연결은 유지하고 콜백만 정리
      };
    }, [])
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
    refetchInterval: 30000, // 30초마다 자동 새로고림 (빈번한 업데이트)
  });

  // 임시로 목업 데이터도 유지 (API 없을 경우 대비)
  const [fallbackChatRooms] = useState<ChatRoom[]>(generateMockData(0));

  // 실제 데이터가 있으면 변환해서 사용, 없으면 목업 데이터 사용
  const chatRooms = chatRoomsData
    ? transformChatRoomData(chatRoomsData)
    : fallbackChatRooms;

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
