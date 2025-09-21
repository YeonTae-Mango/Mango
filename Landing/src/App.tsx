import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import WebView from "./components/WebView";
import KakaoMap from "./components/KakaoMap";
import MyCategoryChart from "./components/MyCategoryChart";
import MyKeywordChart from "./components/MyKeywordChart";
import MyMonthlyChart from "./components/MyMonthlyChart";
import MyThisMonthChart from "./components/MyThisMonthChart";
import TwoTimeChart from "./components/TwoTimeChart";
import TwoTypeChart from "./components/TwoTypeChart";
import MessageExample from "./components/MessageExample";
import { useReactNativeMessage } from "./hooks/useReactNativeMessage";

// React Native 메시지 핸들러를 사용하는 내부 컴포넌트
function AppContent() {
  const navigate = useNavigate();
  const { onNavigation, onDataUpdate, onUserAction, onError, onSuccess } = useReactNativeMessage();

  useEffect(() => {
    // 네비게이션 메시지 핸들러 등록
    onNavigation((message) => {
      console.log('네비게이션 메시지 수신:', message);
      const { route, params } = message.data;
      
      // React Router를 사용하여 페이지 이동
      if (route) {
        navigate(route, { state: params });
      }
    });

    // 데이터 업데이트 메시지 핸들러 등록
    onDataUpdate((message) => {
      console.log('데이터 업데이트 메시지 수신:', message);
      const { key, value } = message.data;
      
      // 필요에 따라 상태 업데이트 또는 로컬 스토리지 저장
      if (key && value !== undefined) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    // 사용자 액션 메시지 핸들러 등록
    onUserAction((message) => {
      console.log('사용자 액션 메시지 수신:', message);
      const { action, payload } = message.data;
      
      // 액션에 따른 처리
      switch (action) {
        case 'refresh':
          window.location.reload();
          break;
        case 'scrollToTop':
          window.scrollTo(0, 0);
          break;
        case 'showAlert':
          if (payload?.message) {
            alert(payload.message);
          }
          break;
        default:
          console.log('알 수 없는 사용자 액션:', action);
      }
    });

    // 에러 메시지 핸들러 등록
    onError((message) => {
      console.error('에러 메시지 수신:', message);
      const { message: errorMessage, code } = message.data;
      
      // 에러 처리 (예: 토스트 메시지 표시)
      console.error(`에러 [${code}]: ${errorMessage}`);
    });

    // 성공 메시지 핸들러 등록
    onSuccess((message) => {
      console.log('성공 메시지 수신:', message);
      const { message: successMessage, result } = message.data;
      
      // 성공 처리 (예: 토스트 메시지 표시)
      console.log(`성공: ${successMessage}`, result);
    });

  }, [navigate, onNavigation, onDataUpdate, onUserAction, onError, onSuccess]);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/webView" element={<WebView />} />
        <Route path="/kakaoMap" element={<KakaoMap />} />
        <Route path="/myCategoryChart" element={<MyCategoryChart />} />
        <Route path="/myKeywordChart" element={<MyKeywordChart />} />
        <Route path="/myMonthlyChart" element={<MyMonthlyChart />} />
        <Route path="/myThisMonthChart" element={<MyThisMonthChart />} />
        <Route path="/twoTimeChart" element={<TwoTimeChart />} />
        <Route path="/twoTypeChart" element={<TwoTypeChart />} />
        <Route path="/messageExample" element={<MessageExample />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
