import { BarChart3, Map, Users, TrendingUp, Home, Smartphone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AdminDashboard() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-gray-600">mango 서비스의 통계 및 관리 기능</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 사용자</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활성 매칭</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">오늘 신규 가입</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <BarChart3 className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">지역별 활동</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Map className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 증가 추이</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="text-gray-400 mx-auto mb-2" size={48} />
                <p className="text-gray-500">차트 컴포넌트가 여기에 표시됩니다</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">지역별 사용자 분포</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="text-gray-400 mx-auto mb-2" size={48} />
                <p className="text-gray-500">카카오맵이 여기에 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-900">사용자 관리</h4>
              <p className="text-sm text-gray-600">사용자 계정 및 권한 관리</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-900">매칭 관리</h4>
              <p className="text-sm text-gray-600">매칭 상태 및 이력 관리</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-900">통계 리포트</h4>
              <p className="text-sm text-gray-600">상세 통계 및 리포트 생성</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
