import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import TwoTypeTabContent from '../../components/pattern/TwoTypeTabContent';
import TwoTimeTabContent from '../../components/pattern/TwoTimeTabContent';
import TwoKeywordTabContent from '../../components/pattern/TwoKeywordTabContent';
import TwoCategoryTabContent from '../../components/pattern/TwoCategoryTabContent';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';
import MatchingPatternTab from '../../components/pattern/MatchingPatternTab';

export default function MatchingpatternScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userName, otherUserId } = route.params as { userName: string; otherUserId?: number };
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'type' | 'category' | 'keyword' | 'time'>('type');

  return (
    <Layout showHeader={false}>
      <CustomHeader
        title="소비패턴 궁합"
        onBackPress={() => navigation.goBack()}
      />
      
      {/* 탭 */}
      <MatchingPatternTab
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 탭별 콘텐츠 */}
        {activeTab === 'type' ? (
          <TwoTypeTabContent
            activeTab={activeTab}
            userName={userName}
            otherUserId={otherUserId}
          />
        ) : activeTab === 'category' ? (
          <TwoCategoryTabContent
            activeTab={activeTab}
            userName={userName}
            otherUserId={otherUserId}
          />
        ) : activeTab === 'keyword' ? (
          <TwoKeywordTabContent
            activeTab={activeTab}
            userName={userName}
            otherUserId={otherUserId}
          />
        ) : activeTab === 'time' && (
          <TwoTimeTabContent
            activeTab={activeTab}
            userName={userName}
            otherUserId={otherUserId}
          />
        )}
      </ScrollView>
    </Layout>
  );
}
