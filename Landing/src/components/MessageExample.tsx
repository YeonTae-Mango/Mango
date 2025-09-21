import { useState } from 'react';
import { useReactNativeMessage } from '../hooks/useReactNativeMessage';

/**
 * React Native 메시지 수신/전송 예시 컴포넌트
 */
function MessageExample() {
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
  const { 
    sendMessage, 
    navigateTo, 
    updateData, 
    sendUserAction, 
    sendError, 
    sendSuccess, 
    sendCustomMessage,
    MESSAGE_TYPES 
  } = useReactNativeMessage();

  // 수신된 메시지를 상태에 추가하는 함수
  const addReceivedMessage = (message: any) => {
    setReceivedMessages(prev => [...prev, { ...message, receivedAt: new Date().toLocaleTimeString() }]);
  };

  // React Native로 메시지 전송 예시 함수들
  const handleNavigateToAdmin = () => {
    navigateTo('/admin', { from: 'messageExample' });
  };

  const handleUpdateUserData = () => {
    updateData('userPreferences', { theme: 'dark', language: 'ko' });
  };

  const handleSendUserAction = () => {
    sendUserAction('buttonClick', { buttonId: 'exampleButton', timestamp: Date.now() });
  };

  const handleSendError = () => {
    sendError('테스트 에러 메시지', 'TEST_ERROR_001');
  };

  const handleSendSuccess = () => {
    sendSuccess('작업이 성공적으로 완료되었습니다', { result: 'success' });
  };

  const handleSendCustomMessage = () => {
    sendCustomMessage('test', { customData: 'Hello from WebView!' });
  };

  const clearMessages = () => {
    setReceivedMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">React Native 메시지 통신 예시</h1>
        
        {/* 메시지 전송 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">React Native로 메시지 전송</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={handleNavigateToAdmin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              네비게이션 전송
            </button>
            <button
              onClick={handleUpdateUserData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              데이터 업데이트
            </button>
            <button
              onClick={handleSendUserAction}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              사용자 액션
            </button>
            <button
              onClick={handleSendError}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              에러 메시지
            </button>
            <button
              onClick={handleSendSuccess}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            >
              성공 메시지
            </button>
            <button
              onClick={handleSendCustomMessage}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            >
              커스텀 메시지
            </button>
          </div>
        </div>

        {/* 수신된 메시지 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">수신된 메시지</h2>
            <button
              onClick={clearMessages}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              메시지 지우기
            </button>
          </div>
          
          {receivedMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">아직 수신된 메시지가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {receivedMessages.map((message, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">타입: {message.type}</span>
                    <span className="text-sm text-gray-500">{message.receivedAt}</span>
                  </div>
                  <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
                    {JSON.stringify(message, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 사용법 안내 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">사용법 안내</h3>
          <div className="text-blue-800 space-y-2">
            <p><strong>1. 메시지 수신:</strong> React Native에서 WebView로 메시지를 전송하면 자동으로 수신됩니다.</p>
            <p><strong>2. 메시지 전송:</strong> 위의 버튼들을 클릭하여 React Native 앱으로 메시지를 전송할 수 있습니다.</p>
            <p><strong>3. 메시지 타입:</strong> 네비게이션, 데이터 업데이트, 사용자 액션, 에러, 성공, 커스텀 메시지를 지원합니다.</p>
            <p><strong>4. 개발자 도구:</strong> 브라우저 개발자 도구의 콘솔에서 메시지 통신 로그를 확인할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageExample;
