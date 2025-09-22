import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import WebView from "./components/WebView";
import KakaoMap from "./components/KakaoMap";
import MyCategoryChart from "./components/MyCategoryChart";
import MyKeywordChart from "./components/MyKeywordChart";
import MyMonthlyChart from "./components/MyMonthlyChart";
import MyThisMonthChart from "./components/MyThisMonthChart";
import MyTimeChart from "./components/MyTimeChart";
import TwoTimeChart from "./components/TwoTimeChart";
import TwoTypeChart from "./components/TwoTypeChart";

// React Native 메시지 핸들러를 사용하는 내부 컴포넌트
function AppContent() {
  const navigate = useNavigate();

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
        <Route path="/myTimeChart" element={<MyTimeChart />} />
        <Route path="/twoTimeChart" element={<TwoTimeChart />} />
        <Route path="/twoTypeChart" element={<TwoTypeChart />} />
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
