import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';

import { getUserById } from '../../api/auth';
import { blockUser } from '../../api/block';
import { deleteChatRoom, getChatMessages, getChatRoom } from '../../api/chat';
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
  createdAt?: string; // 원본 날짜 정보
}

export default function ChatRoomScreen() {
  // 네비게이션 및 라우트 훅
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { userName, chatRoomId, userId, profileImageUrl, mainType } =
    route.params as {
      userName: string;
      chatRoomId: string;
      userId?: number;
      profileImageUrl?: string;
      mainType?: string;
    };

  // 디버깅 로그 추가
  console.log('🔍 ChatRoomScreen 파라미터:', { userName, chatRoomId, userId });
  console.log('🔍 현재 사용자:', user);

  // 사용자 정보 조회 (메인 타입을 위해)
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  // 사용자 정보 디버깅
  useEffect(() => {
    if (userInfo) {
      console.log('🔍 사용자 정보 조회 결과:', userInfo);
      console.log('🔍 메인 타입:', (userInfo as any)?.data?.mainType);
    }
  }, [userInfo]);

  // 차단/신고 뮤테이션
  const blockUserMutation = useMutation({
    mutationFn: ({
      requestId,
      targetUserId,
    }: {
      requestId: number;
      targetUserId: number;
    }) => blockUser(requestId, targetUserId),
    onSuccess: (data, variables) => {
      console.log('사용자 차단/신고 성공');
      // 채팅방이 삭제되므로 UI 상태 변경 불필요
    },
    onError: error => {
      console.error('사용자 차단/신고 실패:', error);
      Alert.alert('오류', '차단/신고 처리에 실패했습니다.');
    },
  });

  // 채팅방 삭제 뮤테이션
  const deleteChatRoomMutation = useMutation({
    mutationFn: (roomId: number) => deleteChatRoom(roomId),
    onSuccess: () => {
      console.log('채팅방 삭제 성공');
      // 채팅방 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
    onError: error => {
      console.error('채팅방 삭제 실패:', error);
      Alert.alert('오류', '채팅방 삭제에 실패했습니다.');
    },
  });

  // 채팅방 정보 조회
  const {
    data: chatRoomData,
    isLoading: roomLoading,
    error: roomError,
  } = useQuery({
    queryKey: ['chatRoom', chatRoomId],
    queryFn: () => getChatRoom(parseInt(chatRoomId)),
    enabled: !!chatRoomId,
    staleTime: 0, // 항상 stale 상태로 취급하여 새로운 데이터 요청
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 새로고침
    refetchOnWindowFocus: true, // 포커스 시 새로고침
  });

  // 채팅방 진입 지연 상태 (WebSocket 메시지 처리 시간 확보)
  const [isRoomReady, setIsRoomReady] = useState(false);

  // 채팅방 진입 시 약간의 지연 후 메시지 조회 시작
  useEffect(() => {
    if (chatRoomId) {
      // 500ms 지연 후 메시지 조회 시작 (WebSocket 메시지 처리 시간 확보)
      const timer = setTimeout(() => {
        setIsRoomReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [chatRoomId]);

  // 채팅 메시지 조회 (임시로 1000개 설정)
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => getChatMessages(parseInt(chatRoomId), 0, 1000),
    enabled: !!chatRoomId && isRoomReady, // 채팅방 준비 완료 후에만 실행
    staleTime: 0, // 항상 fresh 데이터로 취급
    refetchOnWindowFocus: true,
  });

  // chatRoomData 로드 시 채팅방 목록 캐시 무효화 (unreadCount 업데이트)
  useEffect(() => {
    if (chatRoomData) {
      console.log('🔍 chatRoomData 로드됨:', chatRoomData);

      // 채팅방 진입 시 unreadCount 업데이트를 위해 채팅방 목록 캐시 무효화
      console.log(
        '🔄 채팅방 진입 - 채팅방 목록 캐시 무효화 (unreadCount 업데이트)'
      );
      queryClient.invalidateQueries({
        queryKey: ['chatRooms', user?.id],
      });
    }
  }, [chatRoomData, queryClient, user?.id]);

  // 메뉴 모달 상태
  const [showMenuModal, setShowMenuModal] = useState(false);
  // FlatList 참조
  const flatListRef = useRef<FlatList>(null);
  // WebSocket 연결 상태
  const [isConnected, setIsConnected] = useState(false);

  // API에서 받은 메시지 데이터를 화면용 데이터로 변환
  const transformMessagesData = useCallback(
    (apiMessages: any[]): Message[] => {
      // console.log('🔄 메시지 데이터 변환 시작:', apiMessages);
      if (!apiMessages || !user) {
        console.log('❌ 메시지 또는 사용자 정보 없음:', { apiMessages, user });
        return [];
      }

      const transformedMessages = apiMessages.map(msg => {
        const messageDate = new Date(msg.createdAt);
        return {
          id: msg.id.toString(),
          text: msg.content || '',
          isMyMessage: msg.senderId === user.id,
          time: messageDate.toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          isRead: msg.isRead || false,
          createdAt: msg.createdAt, // 날짜 구분을 위해 원본 날짜 저장
        };
      });

      // console.log('✅ 변환된 메시지들:', transformedMessages);
      return transformedMessages;
    },
    [user]
  );

  // 날짜별로 메시지를 그룹화하고 날짜 구분선을 추가하는 함수
  const addDateSeparators = useCallback((messages: Message[]): Message[] => {
    if (messages.length === 0) return [];

    const messagesWithDates: Message[] = [];
    let lastDate = '';

    messages.forEach((message, index) => {
      // 메시지의 날짜를 추출
      const messageDateTime = message.createdAt
        ? new Date(message.createdAt)
        : new Date();

      const messageDate = messageDateTime.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });

      // 날짜가 바뀌었거나 첫 메시지인 경우 날짜 구분선 추가
      if (messageDate !== lastDate) {
        messagesWithDates.push({
          id: `date-${index}-${Date.now()}`,
          text: '',
          isMyMessage: false,
          time: '',
          isRead: false,
          date: messageDate,
          isDateSeparator: true,
        });
        lastDate = messageDate;
      }

      messagesWithDates.push(message);
    });

    return messagesWithDates;
  }, []);

  // API에서 받은 메시지 데이터
  const allMessages = useMemo(() => {
    console.log('🔍 메시지 데이터 처리:', {
      messagesData: messagesData ? 'exists' : 'null',
      content: (messagesData as any)?.content ? 'exists' : 'null',
      contentLength: (messagesData as any)?.content?.length || 0,
    });

    if (messagesData && (messagesData as any)?.content) {
      const basicMessages = transformMessagesData(
        (messagesData as any).content
      );
      return addDateSeparators(basicMessages);
    }
    return [];
  }, [messagesData, transformMessagesData, addDateSeparators]);

  // 🎯 채팅방 진입 시 및 메시지 로드 시 자동 스크롤 (맨 아래로)
  useEffect(() => {
    if (allMessages.length > 0 && flatListRef.current) {
      console.log(
        '📱 자동 스크롤: 메시지',
        allMessages.length,
        '개 → 맨 아래로 이동'
      );
      // 약간의 지연을 두어 렌더링 완료 후 스크롤
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages.length]); // 메시지 개수가 변경될 때마다 실행

  const handleProfilePress = () => {
    const userData = (userInfo as any)?.data;
    if (userData) {
      // API로 받은 실제 사용자 정보 전달
      navigation.navigate('ProfileDetail', {
        userName: userData.nickname,
        userId: userData.userId,
        fromScreen: 'Chat',
        // 사용자 전체 정보 전달
        profileData: {
          id: userData.userId,
          nickname: userData.nickname,
          age: userData.age,
          introduction: userData.introduction,
          mainType: userData.mainType,
          food: userData.food,
          keywords: userData.keywords,
          profileImageUrls: userData.profileImageUrls,
          sigungu: userData.sigungu,
          distance: userData.distanceBetweenMe || userData.distance || 0,
        },
      });
    } else {
      // userInfo가 없으면 기본 정보만 전달
      navigation.navigate('ProfileDetail', {
        userName,
        userId,
        fromScreen: 'Chat',
      });
    }
  };

  const handleBackPress = () => {
    if (chatRoomId && user?.id) {
      console.log('🔄 뒤로가기 - 즉시 unreadCount 0으로 캐시 업데이트');

      // 1. 먼저 캐시에서 해당 채팅방의 unreadCount를 즉시 0으로 업데이트
      queryClient.setQueryData(['chatRooms', user.id], (oldData: any) => {
        if (oldData && oldData.content) {
          return {
            ...oldData,
            content: oldData.content.map((room: any) =>
              room.chatRoomId === parseInt(chatRoomId)
                ? { ...room, unreadCount: 0 }
                : room
            ),
          };
        }
        return oldData;
      });

      // 2. 백그라운드에서 getChatRoom API 호출하여 서버 상태 동기화
      getChatRoom(parseInt(chatRoomId))
        .then(() => {
          console.log('✅ 뒤로가기 - 서버 동기화 완료');
          queryClient.invalidateQueries({
            queryKey: ['chatRooms', user.id],
          });
        })
        .catch(error => {
          console.error('❌ 뒤로가기 - 서버 동기화 실패:', error);
        });
    }

    navigation.goBack();
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
        onPress: async () => {
          try {
            // 채팅방 삭제 API 호출
            console.log('🗑️ 매치 취소 - 채팅방 삭제 시도:', chatRoomId);
            await deleteChatRoomMutation.mutateAsync(parseInt(chatRoomId));
            console.log('✅ 매치 취소 - 채팅방 삭제 완료');

            // 성공 메시지와 함께 뒤로가기
            Alert.alert('완료', '매치가 취소되었습니다.', [
              {
                text: '확인',
                onPress: () => navigation.goBack(),
              },
            ]);
          } catch (error) {
            console.error('❌ 매치 취소 실패:', error);
            Alert.alert('오류', '매치 취소에 실패했습니다.');
          }
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
        onPress: async () => {
          // 디버깅 로그 추가
          console.log('🔍 차단 시도 - userId:', userId);
          console.log('🔍 차단 시도 - user?.id:', user?.id);
          console.log('🔍 차단 시도 - chatRoomData:', chatRoomData);

          // userId가 있으면 그대로 사용, 없으면 chatRoomData에서 가져오기
          let targetUserId = userId;
          if (!targetUserId && chatRoomData) {
            // chatRoomData에서 현재 사용자가 아닌 다른 사용자의 ID 찾기
            const roomData = chatRoomData as any;
            console.log('🔍 roomData:', roomData);
            console.log('🔍 roomData.user1Id:', roomData.user1Id);
            console.log('🔍 roomData.user2Id:', roomData.user2Id);
            targetUserId =
              roomData.user1Id === user?.id
                ? roomData.user2Id
                : roomData.user1Id;
          }

          console.log('🔍 최종 targetUserId:', targetUserId);

          if (user?.id && targetUserId) {
            try {
              console.log('✅ 차단 API 호출:', {
                requestId: user.id,
                targetUserId,
              });

              // 1. 사용자 차단 API 호출
              await blockUserMutation.mutateAsync({
                requestId: user.id,
                targetUserId: targetUserId,
              });
              console.log('✅ 사용자 차단 완료');

              // 2. 채팅방 삭제 API 호출
              console.log('🗑️ 차단 후 채팅방 삭제 시도:', chatRoomId);
              await deleteChatRoomMutation.mutateAsync(parseInt(chatRoomId));
              console.log('✅ 채팅방 삭제 완료');

              // 3. 성공 메시지와 함께 뒤로가기
              Alert.alert('완료', '사용자가 차단되었습니다.', [
                {
                  text: '확인',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error('❌ 차단 또는 채팅방 삭제 실패:', error);
            }
          } else {
            console.log('❌ 차단 실패 - 필요한 정보가 없음');
            Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
          }
        },
      },
    ]);
  };

  // 🎯 컴포넌트 마운트 시 초기 스크롤
  useEffect(() => {
    // 컴포넌트가 처음 렌더링된 후 잠시 기다렸다가 스크롤
    const initialScrollTimer = setTimeout(() => {
      if (flatListRef.current) {
        console.log('🚀 초기 마운트: 채팅방 맨 아래로 스크롤');
        flatListRef.current.scrollToEnd({ animated: false });
      }
    }, 300);

    return () => clearTimeout(initialScrollTimer);
  }, []);

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
              console.log('📩 새 메시지 수신:', newMessage);

              // 새 메시지 수신 시 메시지 목록 새로고침
              refetchMessages();

              // 새 메시지 수신 후 자동 스크롤
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 200);
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
  }, [chatRoomId, user?.id, refetchMessages]);

  const handleSendMessage = async (message: string) => {
    if (!isConnected || !chatRoomId) {
      Alert.alert('오류', '채팅 서버에 연결되지 않았습니다.');
      return;
    }

    try {
      // WebSocket으로 메시지 전송
      chatService.sendMessage(
        parseInt(chatRoomId),
        message,
        'TEXT',
        (result: any) => {
          console.log('✅ 메시지 전송 성공:', result);
          // 전송 성공 후 메시지 목록 새로고침
          setTimeout(() => {
            refetchMessages();
          }, 100);

          // 🚀 채팅방 목록 캐시 무효화 (즉시 업데이트를 위해)
          console.log('🔄 채팅방 목록 캐시 무효화 - 즉시 업데이트');
          queryClient.invalidateQueries({
            queryKey: ['chatRooms', user?.id],
          });
        },
        (error: any) => {
          console.error('❌ 메시지 전송 실패:', error);
          Alert.alert('오류', '메시지 전송에 실패했습니다.');
        }
      );

      // 자동 스크롤
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
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
        onPress: async () => {
          // 디버깅 로그 추가
          console.log('🔍 신고 시도 - userId:', userId);
          console.log('🔍 신고 시도 - user?.id:', user?.id);
          console.log('🔍 신고 시도 - chatRoomData:', chatRoomData);

          // userId가 있으면 그대로 사용, 없으면 chatRoomData에서 가져오기
          let targetUserId = userId;
          if (!targetUserId && chatRoomData) {
            // chatRoomData에서 현재 사용자가 아닌 다른 사용자의 ID 찾기
            const roomData = chatRoomData as any;
            console.log('🔍 roomData:', roomData);
            targetUserId =
              roomData.user1Id === user?.id
                ? roomData.user2Id
                : roomData.user1Id;
          }

          console.log('🔍 최종 targetUserId:', targetUserId);

          if (user?.id && targetUserId) {
            try {
              console.log('✅ 신고 API 호출:', {
                requestId: user.id,
                targetUserId,
              });

              // 1. 사용자 신고 API 호출
              await blockUserMutation.mutateAsync({
                requestId: user.id,
                targetUserId: targetUserId,
              });
              console.log('✅ 사용자 신고 완료');

              // 2. 채팅방 삭제 API 호출
              console.log('🗑️ 신고 후 채팅방 삭제 시도:', chatRoomId);
              await deleteChatRoomMutation.mutateAsync(parseInt(chatRoomId));
              console.log('✅ 채팅방 삭제 완료');

              // 3. 성공 메시지와 함께 뒤로가기
              Alert.alert('완료', '사용자가 신고되었습니다.', [
                {
                  text: '확인',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error('❌ 신고 또는 채팅방 삭제 실패:', error);
            }
          } else {
            console.log('❌ 신고 실패 - 필요한 정보가 없음');
            Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
          }
        },
      },
    ]);
  };

  // 로딩 상태
  if (roomLoading || messagesLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ChatHeader
          userName={userName || '로딩중...'}
          showUserInfo={false}
          showMenu={false}
          onBackPress={handleBackPress}
          onProfilePress={() => {}}
          onMenuPress={() => {}}
        />
        <View className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="mt-4 text-gray-600">채팅방을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 에러 상태
  if (roomError || messagesError) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ChatHeader
          userName={userName || '오류'}
          showUserInfo={false}
          showMenu={false}
          onBackPress={handleBackPress}
          onProfilePress={() => {}}
          onMenuPress={() => {}}
        />
        <View className="flex-1 bg-white justify-center items-center px-4">
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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* ✅ 헤더는 KeyboardAvoidingView 밖으로 분리 */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: 'white', // 스크롤 시 겹치지 않게 배경 지정
        }}
      >
        <ChatHeader
          userName={userName}
          profileImageUrl={profileImageUrl}
          mainType={mainType || (userInfo as any)?.data?.mainType}
          showUserInfo={true}
          onBackPress={handleBackPress}
          onProfilePress={handleProfilePress}
          onMenuPress={handleMenuPress}
        />
      </View>

      {/* ✅ 채팅 리스트 + 입력창만 KeyboardAvoidingView로 감싸기 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // 헤더 높이
      >
        <View style={{ flex: 1, paddingTop: 60 /* 헤더 높이에 맞게 */ }}>
          <FlatList
            ref={flatListRef}
            data={allMessages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />
        </View>

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
    </View>
  );
}
