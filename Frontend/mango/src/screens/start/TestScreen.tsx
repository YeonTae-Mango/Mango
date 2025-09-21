import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomHeader from '../../components/common/CustomHeader';
import Layout from '../../components/common/Layout';

export default function TestScreen() {
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);

  const dummyData = {
    data: [103, 432, 223, 1181, 6680, 768000, 2600]
  };

  // WebView가 로드된 후 데이터 메시지 전송
  const handleWebViewLoad = () => {
    webViewRef.current?.postMessage(JSON.stringify(dummyData));
  };

  return (
    <Layout showHeader={false}>
      <CustomHeader title="테스트" onBackPress={() => navigation.goBack()} />
      
      <View className="flex-1 bg-white">
        <WebView 
          ref={webViewRef}
          source={{uri: 'http://70.12.246.220:5173/myCategoryChart'}}
          onLoadEnd={handleWebViewLoad}
          originWhitelist={['*']}
          style={{ flex: 1 }}
        />
      </View>
    </Layout>
  );
}

