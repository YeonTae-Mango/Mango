import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Layout from '../../components/common/Layout';

export default function MangoScreen() {
  return (
    <Layout headerTitle="mango">
      <View style={styles.container}>
        <Text style={styles.title}>망고</Text>
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
    color: '#FF6D60',
  },
});
