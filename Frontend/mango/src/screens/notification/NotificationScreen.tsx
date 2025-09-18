import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import NotificationItem from '../../components/notification/NotificationItem';
import { NotificationData, NotificationType } from '../../types/notification';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();

  const notifications: NotificationData[] = [
    {
      id: '1',
      type: NotificationType.NEW_MATCH,
      title: '새로운 매칭이 있어요!',
      subtitle: '태호씨 님과 매치되었습니다',
      userId: 'user123',
    },
    {
      id: '2',
      type: NotificationType.NEW_MESSAGE,
      title: '메시지가 도착했어요!',
      subtitle: '태호씨 님으로부터 새 메시지가 왔습니다',
      userId: 'user123',
      chatRoomId: 'chat456',
    },
    {
      id: '3',
      type: NotificationType.MANGO_RECEIVED,
      title: '망고를 받았어요!',
      subtitle: '태호씨 님이 나를 망고 했습니다',
      userId: 'user123',
    },
    {
      id: '4',
      type: NotificationType.MYDATA_CONNECTED,
      title: '마이데이터 연동이 완료되었어요',
      subtitle: '태호씨 님의 대표 유형을 확인해 보세요',
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNotificationPress = (notification: NotificationData) => {
    switch (notification.type) {
      // 새로운 매칭 - Main으로 이동 후 ChatList로 이동
      case NotificationType.NEW_MATCH:
        navigation.navigate('Main', {
          screen: 'Chat',
          params: {
            screen: 'ChatList',
            params: { userId: notification.userId },
          },
        });
        break;

      // 새로운 메시지 - Main으로 이동 후 ChatRoom으로 이동
      case NotificationType.NEW_MESSAGE:
        navigation.navigate('Main', {
          screen: 'Chat',
          params: {
            screen: 'ChatRoom',
            params: {
              chatRoomId: notification.chatRoomId,
              userId: notification.userId,
            },
          },
        });
        break;

      // 망고 받음 - Main으로 이동 후 상대방 ProfileDetail로 이동
      case NotificationType.MANGO_RECEIVED:
        navigation.navigate('Main', {
          screen: 'Chat',
          params: {
            screen: 'ProfileDetail',
            params: { userId: notification.userId },
          },
        });
        break;

      // 마이데이터 연동 완료 - Main으로 이동 후 Profile 탭으로 이동
      case NotificationType.MYDATA_CONNECTED:
        navigation.navigate('Main', {
          screen: 'Profile',
          params: {
            screen: 'ProfileMain',
          },
        });
        break;

      default:
        console.log('Unknown notification type:', notification.type);
        break;
    }
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="알림"
        onBackPress={handleBackPress}
        showBackButton={true}
      />

      <ScrollView className="flex-1 bg-white">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            {...notification}
            onPress={handleNotificationPress}
          />
        ))}
      </ScrollView>
    </Layout>
  );
}
