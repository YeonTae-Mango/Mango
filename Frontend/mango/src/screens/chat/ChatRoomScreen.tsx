import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ChatHeader from '../../components/chat/ChatHeader';

export default function ChatRoomScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName } = route.params as {
    userName: string;
    chatRoomId: string;
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileDetail', { userName });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader
        userName={userName}
        showUserInfo={true}
        showMenu={true}
        onBackPress={() => navigation.goBack()}
        onProfilePress={handleProfilePress}
        onMenuPress={() => {
          // 메뉴 버튼 클릭 시 동작
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{userName}과의 채팅방</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
