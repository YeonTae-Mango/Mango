import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ChatHeader from '../../components/chat/ChatHeader';

export default function MatchingpatternScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName } = route.params as { userName: string };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader
        title="소비패턴 궁합"
        showUserInfo={false}
        showMenu={false}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{userName}님과의 소비패턴 궁합</Text>
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
    marginBottom: 40,
    textAlign: 'center',
  },
});
