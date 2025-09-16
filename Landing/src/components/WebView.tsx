import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Smartphone } from "lucide-react";

function WebView() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // HTML 파일 목록
  const htmlFiles = [
    { name: 'myCategoryChart', displayName: '카테고리 차트', path: '/myCategoryChart' },
    { name: 'myKeywordChart', displayName: '키워드 차트', path: '/myKeywordChart' },
    { name: 'myMonthlyChart', displayName: '월별 차트', path: '/myMonthlyChart' },
    { name: 'myThisMonthChart', displayName: '이번 달 차트', path: '/myThisMonthChart' },
    { name: 'twoTimeChart', displayName: '시간대별 차트', path: '/twoTimeChart' },
    { name: 'twoTypeChart', displayName: '타입별 차트', path: '/twoTypeChart' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-orange-500">mango</div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/") 
                    ? "bg-orange-100 text-orange-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Home size={18} />
                <span className="text-sm font-medium">랜딩</span>
              </Link>

              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/admin") 
                    ? "bg-orange-100 text-orange-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <BarChart3 size={18} />
                <span className="text-sm font-medium">관리자</span>
              </Link>

              <Link
                to="/webView"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/webView") 
                    ? "bg-orange-100 text-orange-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Smartphone size={18} />
                <span className="text-sm font-medium">웹뷰</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">웹뷰 차트 선택</h1>
          <p className="text-gray-600">원하는 차트를 선택하여 확인하세요</p>
        </div>

        {/* Chart Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {htmlFiles.map((file) => (
            <Link
              key={file.name}
              to={file.path}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-center group"
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors">
                  <BarChart3 className="text-orange-600" size={32} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{file.displayName}</h3>
              <p className="text-sm text-gray-600">{file.name}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default WebView;
