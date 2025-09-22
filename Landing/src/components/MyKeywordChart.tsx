import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useWebViewMessage } from '../hooks/useWebViewMessage';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function MyKeywordChart() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  // React Native WebView에서 메시지 수신
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('MyKeywordChart에서 파싱된 데이터 수신:', data.data);
    console.log('data.labels:', data.data.labels);
    console.log('data.data:', data.data.data);
    setParsedData(data.data);
  });

  // 기본 차트 데이터
  const defaultChartLabels = ['#웹프론트', '#메케닉', '#편의점러버', '#아티스트', '#탑건', '#트렌드세터'];
  const defaultChartData = [100, 80, 60, 40, 20, 10];
  
  // 받은 데이터가 있으면 사용, 없으면 기본값 사용
  const chartLabels = (parsedData && parsedData.labels && Array.isArray(parsedData.labels)) 
    ? parsedData.labels 
    : defaultChartLabels;
    
  const chartDataValues = (parsedData && parsedData.data && Array.isArray(parsedData.data)) 
    ? parsedData.data 
    : defaultChartData;

  // 차트 데이터 (동적으로 변경)
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues,
        borderColor: 'rgb(255,100,25,1)',
        backgroundColor: 'rgb(255,100,25,0.5)',
        fill: true,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    scales: {
      x: {
        grid: {
          display: true
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.parsed.x.toLocaleString() + '점';
          }
        }
      }
    },
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Chart */}
        <div className="w-96 h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 키워드 차트 메시지 정보 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">키워드 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>라벨:</strong> {JSON.stringify(parsedData.labels) || 'N/A'}</div>
                <div><strong>데이터:</strong> {JSON.stringify(parsedData.data, null, 2)}</div>
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

export default MyKeywordChart;
