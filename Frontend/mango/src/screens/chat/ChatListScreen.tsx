import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import ChatItem from '../../components/chat/ChatItem';
import Layout from '../../components/common/Layout';

interface ChatRoom {
  chatRoomId: string;
  userName: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

interface ChatListScreenProps {
  onLogout: () => void;
}

// 임시 데이터
const generateMockData = (page: number): ChatRoom[] => {
  const mockUsers = [
    '홍길동',
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
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(generateMockData(0));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleChatPress = (chatRoomId: string, userName: string) => {
    navigation.navigate('ChatRoom', {
      chatRoomId,
      userName,
    });
  };

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    // 실제 API 호출 시뮬레이션
    setTimeout(() => {
      const newPage = page + 1;
      const newData = generateMockData(newPage);

      if (newPage >= 5) {
        // 5페이지까지만 로드
        setHasMore(false);
      }

      setChatRooms(prev => [...prev, ...newData]);
      setPage(newPage);
      setLoading(false);
    }, 1000);
  }, [loading, hasMore, page]);

  const renderChatItem = ({ item }: { item: ChatRoom }) => (
    <ChatItem
      chatRoomId={item.chatRoomId}
      userName={item.userName}
      lastMessage={item.lastMessage}
      time={item.time}
      unreadCount={item.unreadCount}
      onPress={handleChatPress}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator className="py-4" size="small" color="#FF6B6B" />;
  };

  return (
    <Layout onLogout={onLogout}>
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
