import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BaseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>베이스</Text>
    </View>
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
