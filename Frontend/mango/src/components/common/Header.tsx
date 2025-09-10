import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'mango' }: HeaderProps) {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightSection}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <Ionicons name="settings-outline" size={24} color="#333" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 50, // 상태바 공간 확보
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6D60',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
});
