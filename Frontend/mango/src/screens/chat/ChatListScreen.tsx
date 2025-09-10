import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Layout from '../../components/common/Layout';

export default function ChatListScreen() {
  return (
    <Layout headerTitle="mango">
      <View style={styles.container}>
        <Text style={styles.title}>채팅 목록</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
