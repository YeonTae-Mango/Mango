import React from 'react';
import { View } from 'react-native';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  showHeader?: boolean;
}

export default function Layout({
  children,
  onLogout,
  showHeader = true,
}: LayoutProps) {
  return (
    <View className="flex-1 bg-white">
      {showHeader && <Header onLogout={onLogout} />}
      <View className="flex-1">{children}</View>
    </View>
  );
}
