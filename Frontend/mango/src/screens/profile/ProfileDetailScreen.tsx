import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Layout from '../../components/common/Layout';

export default function ProfileDetailScreen() {
  return (
    <Layout headerTitle="mango">
      <View style={styles.container}>
        <Text style={styles.title}>프로필 상세</Text>
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
