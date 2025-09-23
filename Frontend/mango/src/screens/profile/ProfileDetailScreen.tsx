import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { createOrGetChatRoom } from '../../api/chat';
import { sendMangoLike } from '../../api/swipe';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import ProfileCard from '../../components/profile/ProfileCard';
import { useAuthStore } from '../../store/authStore';

export default function ProfileDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName, fromScreen, userId, activeTab } = route.params as {
    userName: string;
    fromScreen?: string;
    userId?: number;
    activeTab?: 'received' | 'sent';
  };

  // 현재 로그인된 사용자 정보
  const { user } = useAuthStore();
  const currentUserId = user?.id || 0;

  // 망고 버튼 로딩 상태
  const [isMangoLoading, setIsMangoLoading] = useState(false);

  // 망고 화면에서 온 경우 소비패턴 궁합 보기 버튼 숨김
  // 나를 망고한 사람 탭(received)에서만 망고하기 버튼 표시
  const showMatchingButton = fromScreen !== 'Mango';
  const showMangoButton = fromScreen === 'Mango' && activeTab === 'received';

  // 채팅방 생성 뮤테이션
  const createChatRoomMutation = useMutation({
    mutationFn: createOrGetChatRoom,
    onSuccess: chatRoomData => {
      console.log('🎉 채팅방 생성 성공:', chatRoomData);
      console.log(
        '🔍 chatRoomData 상세:',
        JSON.stringify(chatRoomData, null, 2)
      );
      setIsMangoLoading(false);

      // API 응답에서 상대방 정보 추출
      const roomData = chatRoomData as any;
      const otherUserName = roomData.otherUser?.nickname || userName;
      const otherUserId =
        roomData.otherUser?.userId ||
        (roomData.user1Id === currentUserId
          ? roomData.user2Id
          : roomData.user1Id);

      console.log('🔍 추출된 정보:', {
        otherUserName,
        otherUserId,
        roomId: roomData.id,
        currentUserId,
        user1Id: roomData.user1Id,
        user2Id: roomData.user2Id,
      });

      // 매치 성공 알림 후 채팅방으로 이동
      Alert.alert(
        '🎉 매치 성공!',
        `${otherUserName}님과 매치되었습니다! 채팅을 시작해보세요.`,
        [
          {
            text: '나중에',
            style: 'default',
            onPress: () => {
              // 채팅방은 이미 생성되었으므로 뒤로가기만
              console.log(
                '🎉 매치 성공! 채팅방 생성됨 - 나중에 채팅 목록에서 접근 가능'
              );
              navigation.goBack();
            },
          },
          {
            text: '채팅하기',
            onPress: () => {
              console.log('🚀 채팅방으로 이동:', {
                chatRoomId: roomData.id.toString(),
                userName: otherUserName,
                userId: otherUserId,
                profileImageUrl: roomData.otherUserProfileImage,
              });
              navigation.navigate('ChatRoom', {
                chatRoomId: roomData.id.toString(),
                userName: otherUserName,
                userId: otherUserId,
                profileImageUrl: roomData.otherUserProfileImage,
              });
            },
          },
        ]
      );
    },
    onError: error => {
      console.error('❌ 채팅방 생성 실패:', error);
      setIsMangoLoading(false);
      Alert.alert('오류', '채팅방 생성에 실패했습니다.');
    },
  });

  // 망고 보내기 뮤테이션
  const mangoMutation = useMutation({
    mutationFn: ({
      userId,
      requestId,
    }: {
      userId: number;
      requestId: number;
    }) => sendMangoLike(userId, requestId),
    onSuccess: response => {
      console.log('🥭 망고 보내기 성공:', response);

      // 나를 망고한 사람에게 망고를 보내는 경우 무조건 매칭 성공
      if (activeTab === 'received' && userId) {
        console.log(
          '🎉 나를 망고한 사람에게 망고 보냄 -> 자동 매칭 성공! 채팅방 생성 중...'
        );
        createChatRoomMutation.mutate(userId);
        return;
      }

      // 기타 경우 매칭 조건 확인
      const isMatched =
        response.matched ||
        response.isMatched ||
        response.match ||
        response.message?.includes('매치') ||
        response.message?.includes('match') ||
        response.message?.includes('서로') ||
        response.message?.includes('mutual');

      if (isMatched && userId) {
        console.log('🎉 매치 성공! 채팅방 생성 중...');
        // 매치 성공 시 채팅방 생성
        createChatRoomMutation.mutate(userId);
      } else {
        // 일반 망고 전송 성공
        setIsMangoLoading(false);
        Alert.alert(
          '🥭 망고 전송 완료',
          `${userName}님에게 망고를 보냈습니다!`,
          [
            {
              text: '확인',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    },
    onError: error => {
      console.error('❌망고 보내기 실패:', error);
      setIsMangoLoading(false);
      Alert.alert('오류', '망고 보내기에 실패했습니다.');
    },
  });

  // 소비패턴 궁합 보기 버튼 핸들러
  const handleMatchingPattern = () => {
    navigation.navigate('MatchingPattern', { userName });
  };

  // 망고하기 버튼 핸들러
  const handleMango = () => {
    if (!userId || !currentUserId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setIsMangoLoading(true);
    mangoMutation.mutate({
      userId: currentUserId,
      requestId: userId,
    });
  };

  // 더미 프로필 데이터 (실제로는 API에서 가져올 데이터)
  const profileData = {
    name: userName,
    age: 28,
    distance: '21km',
    category: '핫플헌터',
    tags: ['카페인중독', '빵순이', '단발병'],
    introduction: '아 씨탈하고 싶다',
    images: [
      'https://postfiles.pstatic.net/MjAyNDA4MDVfMTcx/MDAxNzIyODMzNDI0MzY5.wuG29NRvdZ6kQc0I6xhLTi-AeKIehY4AMD_rvRo6bBog.Aw-JsI21ibU34Wj-YJj-wXoirkPwbTBIT_KyNyzc4hgg.JPEG/IMG_2048.JPG?type=w966',
    ],
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title={`${profileData.name}님의 프로필`}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 프로필 카드 */}
        <ProfileCard
          name={profileData.name}
          age={profileData.age}
          distance={profileData.distance}
          category={profileData.category}
          tags={profileData.tags}
          introduction={profileData.introduction}
          images={profileData.images}
        />

        {/* 하단 정보 및 버튼 영역 */}
        <View className="p-4">
          {/* 정보 박스 */}
          <View className="bg-gray rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={24} color="#000000" />
              <Text className="text-body-large-semibold text-dark ml-2">
                {userName}님은 핫플헌터 유형입니다
              </Text>
            </View>
            <Text className="text-medium-regular text-text-primary leading-5 px-2">
              이것은 핫플헌터에 대한 설명으로 사용자에게 핫플헌터 무엇인지 알려
              정확하고 명확하게 설명해줄 수 있는 텍스트로 구성되어있음. 이것은
              핫플헌터에 대한 설명으로 사용자에게 핫플헌터 무엇인지 알려
              정확하고 명확하게 설명해줄 수 있는 텍스트로 구성되어있음.
            </Text>
          </View>

          {/* 소비패턴 궁합 보기 버튼 */}
          {showMatchingButton && (
            <TouchableOpacity
              className="bg-mango-red rounded-2xl py-4 items-center"
              onPress={handleMatchingPattern}
            >
              <Text className="text-white text-subheading-regular">
                나와의 소비 궁합 보러 가기
              </Text>
            </TouchableOpacity>
          )}

          {/* 망고하기 버튼 */}
          {showMangoButton && (
            <TouchableOpacity
              className={`rounded-2xl py-4 items-center ${
                isMangoLoading || mangoMutation.isPending
                  ? 'bg-gray-400'
                  : 'bg-mango-red'
              }`}
              onPress={handleMango}
              disabled={isMangoLoading || mangoMutation.isPending}
            >
              <Text className="text-white text-subheading-regular">
                {isMangoLoading || mangoMutation.isPending
                  ? '망고 보내는 중...'
                  : `${userName} 님에게 망고하기`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}
