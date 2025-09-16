import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';
import { useWebViewMessage } from '../hooks/useWebViewMessage';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function MyCategory() {
  // 기본 차트 데이터
  const defaultData = [10, 0, 0, 0, 0, 0, 0];
  const [chartData, setChartData] = useState(defaultData);
  
  // WebView 메시지 수신 훅 사용
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('받은 전체 데이터:', data);
    console.log('현재 차트 데이터:', chartData);
    
    // 받은 데이터로 차트 업데이트
    if (data && data.data && Array.isArray(data.data)) {
      console.log('차트 데이터 업데이트 시도:', data.data);
      setChartData(data.data);
      console.log('차트 데이터 업데이트 완료');
    } else {
      console.log('데이터 형식이 올바르지 않음:', data);
    }
  });
  
  const chartConfig = {
    labels: ['공연/전시', '미디어/통신', '생활서비스', '소매/유통', '여가/오락', '음식', '학문/교육'],
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255, 159, 64)',
          'rgba(199, 199, 199)'
        ],
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Chart */}
      <div className="w-96 h-96">
        <Doughnut data={chartConfig} options={chartOptions} />
      </div>
      {/* 디버깅용 메시지 표시 영역 */}
      <div className="ml-4 p-4 bg-white rounded shadow">
        <h3 className="font-bold mb-2">React Native에서 받은 메시지:</h3>
        <div className="mb-2">
          <span className="text-lg text-blue-600">{receivedMessage || '메시지를 기다리는 중...'}</span>
        </div>
        <div className="mt-2">
          <h4 className="font-bold text-sm">현재 차트 데이터:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(chartData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default MyCategory;