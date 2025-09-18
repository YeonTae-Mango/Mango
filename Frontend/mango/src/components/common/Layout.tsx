import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  showHeader?: boolean;
  showBottomSafeArea?: boolean; // 하단 SafeArea 표시 여부
}

export default function Layout({
  children,
  onLogout,
  showHeader = true,
  showBottomSafeArea = true, // 기본값 true로 설정
}: LayoutProps) {
  return (
    <View className="flex-1 bg-white">
      {showHeader && <Header onLogout={onLogout} />}
      <View className="flex-1">{children}</View>
      {/* 하단 SafeArea - TabBar가 없는 화면에서 갤럭시 네비게이션 바와 겹치지 않도록 */}
      {showBottomSafeArea && (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }} />
      )}
    </View>
  );
}
