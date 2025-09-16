import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  showMoreButton?: boolean;
  onMorePress?: () => void;
  moreIcon?: string;
}

export default function CustomHeader({
  title,
  onBackPress,
  showBackButton = true,
  showMoreButton = false,
  onMorePress,
  moreIcon = 'ellipsis-horizontal',
}: CustomHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View
        className="flex-row items-center justify-between p-4 bg-white"
        style={{ paddingTop: Math.max(insets.top, 16) + 16 }}
      >
        {/* 뒤로가기 버튼 */}
        <View className="w-6">
          {showBackButton && onBackPress && (
            <TouchableOpacity onPress={onBackPress}>
              <Ionicons name="chevron-back" size={24} color="#8899A8" />
            </TouchableOpacity>
          )}
        </View>

        {/* 타이틀 */}
        <View className="flex-1 items-center">
          <Text
            className="text-subheading-regular text-text-primary"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* 더보기 버튼 */}
        <View className="w-6 items-end">
          {showMoreButton && onMorePress && (
            <TouchableOpacity onPress={onMorePress}>
              <Ionicons name={moreIcon as any} size={24} color="#8899A8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}
