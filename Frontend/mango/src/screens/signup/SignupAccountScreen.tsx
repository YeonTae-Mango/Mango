import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import Layout from '../../components/common/Layout';
import CustomHeader from '../../components/common/CustomHeader';
import SignupButton from '../../components/signup/SignupButton';
import SignupTitle from '../../components/signup/SignupTitle';
import SignupDescription from '../../components/signup/SignupDescription';
import AccountTermsModal from '../../components/signup/AccountTermsModal';

export default function SignupAccountScreen() {
  const navigation = useNavigation<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAccountLink = () => {
    // 모달 표시
    setIsModalVisible(true);
  };

  const handleAgree = () => {
    // 실제 구현에서는 계좌 연동 로직을 구현
    console.log('계좌 연동 약관 동의 완료');
    setIsModalVisible(false);
    // 계좌 연동 완료 화면으로 이동
    navigation.navigate('SignupAccountComplete');
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="회원가입"
        onBackPress={() => navigation.goBack()}
      />
      
      <View className="flex-1 bg-white px-12 pt-10">
        {/* 메인 제목 */}
        <View className="flex-1 justify-center items-center">
          <SignupTitle 
            title={"내 소비를 자세히 분석하기 위해\n계좌정보를 연동해주세요"} 
          />
          
          {/* 개인정보 보호 안내 */}
          <SignupDescription 
            description={"계좌 내 거래내역은\n소비 패턴 분석에만 사용되며\n안전하게 보호됩니다"}
          />
        </View>

        {/* 연동하기 버튼 */}
        <SignupButton
          text="연동하기"
          onPress={handleAccountLink}
          isActive={true}
        />
      </View>

      {/* 계좌 연동 약관 모달 */}
      <AccountTermsModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAgree={handleAgree}
      />
    </Layout>
  );
}
