import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/common/CustomHeader';

export default function TestScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <CustomHeader title="테스트" onBackPress={() => navigation.goBack()} />
      
      <View className="flex-1 bg-white justify-center items-center px-4">
        <Text className="text-heading-bold text-text-primary text-center">
          네이버 지도 기능이{'\n'}LocationForm으로 이동되었습니다
        </Text>
        <Text className="text-body-medium text-secondary text-center mt-4">
          회원가입 화면에서 위치 선택 단계를 확인해보세요!
        </Text>
      </View>
    </SafeAreaView>
  );
}