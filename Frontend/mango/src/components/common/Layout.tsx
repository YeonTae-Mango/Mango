import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header onLogout={onLogout} />
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
