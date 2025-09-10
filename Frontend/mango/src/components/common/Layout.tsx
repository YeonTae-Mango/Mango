import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  onLogout?: () => void;
}

export default function Layout({
  children,
  headerTitle,
  onLogout,
}: LayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title={headerTitle} onLogout={onLogout} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
