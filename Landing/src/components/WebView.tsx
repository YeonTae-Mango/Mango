import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import Navigation from "./Navigation";

function WebView() {
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
      <Navigation />

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
