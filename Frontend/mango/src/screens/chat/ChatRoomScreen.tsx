import Layout from '@/src/components/common/Layout';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatMenuModal from '../../components/chat/ChatMenuModal';

export default function ChatRoomScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName } = route.params as {
    userName: string;
    chatRoomId: string;
  };
  const [showMenuModal, setShowMenuModal] = useState(false);

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
    <Layout showHeader={false}>
      <ChatHeader
        userName={userName}
        showUserInfo={true}
        showMenu={true}
        onBackPress={() => navigation.goBack()}
        onProfilePress={handleProfilePress}
        onMenuPress={handleMenuPress}
      />

      <View className="flex-1 justify-center items-center bg-white px-5">
        <Text className="text-2xl font-bold mb-2.5">{userName}과의 채팅방</Text>
      </View>

      <ChatMenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        onReportChat={handleReportChat}
        onBlockUser={handleBlockUser}
        onReportUser={handleReportUser}
      />
    </Layout>
  );
}
