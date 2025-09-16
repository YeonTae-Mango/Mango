import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import WebView from "./components/WebView";
import MyCategoryChart from "./components/MyCategoryChart";
import MyKeywordChart from "./components/MyKeywordChart";
import MyMonthlyChart from "./components/MyMonthlyChart";
import MyThisMonthChart from "./components/MyThisMonthChart";
import TwoTimeChart from "./components/TwoTimeChart";
import TwoTypeChart from "./components/TwoTypeChart";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/webView" element={<WebView />} />
          <Route path="/myCategoryChart" element={<MyCategoryChart />} />
          <Route path="/myKeywordChart" element={<MyKeywordChart />} />
          <Route path="/myMonthlyChart" element={<MyMonthlyChart />} />
          <Route path="/myThisMonthChart" element={<MyThisMonthChart />} />
          <Route path="/twoTimeChart" element={<TwoTimeChart />} />
          <Route path="/twoTypeChart" element={<TwoTypeChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
