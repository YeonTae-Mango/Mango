import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Layout from '../../components/common/Layout';
import MangoCard from '../../components/mango/MangoCard';
import MangoTab from '../../components/mango/MangoTab';

interface MangoScreenProps {
  onLogout: () => void;
}

export default function MangoScreen({ onLogout }: MangoScreenProps) {
  // 망고 카드 클릭 핸들러
  const navigation = useNavigation<any>();
  const handleProfilePress = (userName: string) => {
    navigation.navigate('ProfileDetail', { userName, fromScreen: 'Mango' });
  };

  // 탭 상태에 따른 API 호출
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const handleTabChange = (tab: 'received' | 'sent') => {
    setActiveTab(tab);
    // TODO: 탭에 따라 다른 API 호출
  };

  // 더미 데이터
  const users = [
    {
      id: 1,
      name: '지민',
      age: 25,
      distance: '21km',
      category: '핫플헌터형',
      image:
        'https://postfiles.pstatic.net/MjAyNDAzMjdfODcg/MDAxNzExNTIwODY2MjYw.SeHD4lU8aCDdG9ELcZ0n-eNmFlT3Bt6Xe_FV1NSYaKEg.O8hZGdYhlsQEVQtz_PS7LvFuoddi4AnivEhP6hWLqCog.JPEG/KakaoTalk_20240327_121140260_03.jpg?type=w966',
    },
    {
      id: 2,
      name: '닝닝',
      age: 28,
      distance: '15km',
      category: '쇼핑형',
      image:
        'https://postfiles.pstatic.net/MjAyNDEyMDhfMjQz/MDAxNzMzNTkxMjY4MDI1.iGA7cEtdSReYVauJlU_uBD-TmFS8iEiM5LcSWtfH4Fog.T-_SCnvXfo37az1FrwrdCAbIFme1YA-Q6HBU6kdFxGMg.JPEG/IMG_0767.JPG?type=w466',
    },
    {
      id: 3,
      name: '민정',
      age: 24,
      distance: '10km',
      category: '예술가형',
      image:
        'https://postfiles.pstatic.net/MjAyNDA4MDVfMTcx/MDAxNzIyODMzNDI0MzY5.wuG29NRvdZ6kQc0I6xhLTi-AeKIehY4AMD_rvRo6bBog.Aw-JsI21ibU34Wj-YJj-wXoirkPwbTBIT_KyNyzc4hgg.JPEG/IMG_2048.JPG?type=w966',
    },
    {
      id: 4,
      name: '애리',
      age: 26,
      distance: '5km',
      category: '스포츠형',
      image:
        'https://postfiles.pstatic.net/MjAyNTA4MjVfMTgg/MDAxNzU2MTA2NzU5OTYx.H9w2GTIAyitlhAFm5Qd8g2XEg9ZA--CkJ-q5odZpp7Ag.jHEOdWPtDycOvz-fVwqdUxy5FiLAhgbs1m0QwiwT72Ug.JPEG/IMG%EF%BC%BF5292.JPG?type=w966',
    },
    {
      id: 5,
      name: '안유진',
      age: 25,
      distance: '31km',
      category: '여행가형',
      image:
        'https://postfiles.pstatic.net/MjAyNDA3MTBfMTgw/MDAxNzIwNTg1MDE4Mjgx.x7iPNaqn7G9hYBmU3Yaq_wK-MMAfUy4yETnPskXjqcsg.8tubCWkFAOMa8HGl7hMTMyZDhq3oL2o510YLrJCQG6Ag.JPEG/Snapinsta.app_424432795_330500819976302_4624198180240654599_n_1080.jpg?type=w966',
    },
    {
      id: 6,
      name: '원영공주',
      age: 28,
      distance: '15km',
      category: '자기계발형',
      image:
        'https://postfiles.pstatic.net/MjAyNTAyMjZfMjMz/MDAxNzQwNTMyNDI0NTI2.RBOn_o29RT6gl0JUqMOnQQtZH-Ej_ZY_EMk6relxCjMg.KOvtEqAG9J6PzH1VtLqbRNKydvUODa9Ll-2bLdoiL2cg.PNG/image.png?type=w773',
    },
  ];

  return (
    <Layout onLogout={onLogout}>
      <View className="flex-1 bg-white">
        {/* 탭 컴포넌트 */}
        <MangoTab activeTab={activeTab} onTabChange={handleTabChange} />

        {/* 스크롤 가능한 카드 목록 */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 20,
          }}
        >
          <View className="flex-row flex-wrap justify-between">
            {users.map(user => (
              <MangoCard
                key={user.id}
                user={user}
                onPress={handleProfilePress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
}
