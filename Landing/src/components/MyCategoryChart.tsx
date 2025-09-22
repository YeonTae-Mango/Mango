import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useWebViewMessage } from '../hooks/useWebViewMessage';
import { useState } from 'react';
import { getCategoryColors } from '../utils/categoryColors';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function MyCategory() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('MyCategoryChart에서 파싱된 데이터 수신:', data);
    console.log('data.type:', data.type);
    console.log('data.data:', data.data);
    setParsedData(data.data);
  });

  // 기본 차트 데이터
  const defaultChartData = [103000, 432000, 223000, 1181000, 668000, 768000, 268000];
  const defaultChartLabels = ['공연/전시', '미디어/통신', '생활서비스', '소매/유통', '여가/오락', '음식', '학문/교육'];
  
  // 받은 데이터가 있고 배열이면 사용, 아니면 기본값 사용
  const chartDataValues = (parsedData && parsedData.data && Array.isArray(parsedData.data)) 
    ? parsedData.data 
    : defaultChartData;
    
  // 받은 라벨이 있고 배열이면 사용, 아니면 기본값 사용
  const chartLabels = (parsedData && parsedData.labels && Array.isArray(parsedData.labels)) 
    ? parsedData.labels 
    : defaultChartLabels;

  // 총 소비액 - API에서 받은 total 값 사용, 없으면 계산
  const totalAmount = (parsedData && parsedData.total) 
    ? parsedData.total 
    : chartDataValues.reduce((sum: number, value: number) => sum + value, 0);

  // 차트 데이터 (동적으로 변경)
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues,
        backgroundColor: getCategoryColors(chartLabels),
        hoverOffset: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.parsed.toLocaleString() + '원';
          }
        }
      }
    },
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Chart Container with Center Text */}
        <div className="relative w-96 h-96">
          <Doughnut data={chartData} options={chartOptions} />
          
          {/* 중앙에 총 소비액 표시 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-lg font-semibold text-gray-600">총 소비액</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(totalAmount / 10000).toLocaleString()}만원
            </div>
          </div>
        </div>
      </div>
      
      {/* 디버깅 정보 화면 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">카테고리 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>타입:</strong> {parsedData.type || 'N/A'}</div>
                <div><strong>전체 데이터:</strong> {JSON.stringify(parsedData, null, 2)}</div>
                <div><strong>data 필드:</strong> {JSON.stringify(parsedData.data)}</div>
                <div><strong>labels 필드:</strong> {JSON.stringify(parsedData.labels)}</div>
                <div><strong>데이터 타입:</strong> {Array.isArray(parsedData.data) ? '배열' : typeof parsedData.data}</div>
                <div><strong>라벨 타입:</strong> {Array.isArray(parsedData.labels) ? '배열' : typeof parsedData.labels}</div>
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>현재 라벨:</strong> [{chartLabels.join(', ')}]</div>
            <div><strong>현재 데이터:</strong> [{chartDataValues.join(', ')}]</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default MyCategory;