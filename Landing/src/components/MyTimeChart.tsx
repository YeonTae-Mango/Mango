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

function MyTimeChart() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  // React Native WebView에서 메시지 수신
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('MyTimeChart에서 파싱된 데이터 수신:', data);
    console.log('data.type:', data.type);
    console.log('data.data:', data.data);
    setParsedData(data);
  });

  // 기본 차트 데이터
  const defaultMyData = [4, 25, 18, 10];   // 나
  const defaultTimeLabels = ["06시", "12시", "18시", "24시"];
  
  // 받은 데이터가 있으면 사용, 없으면 기본값 사용
  const timeLabels = (parsedData && parsedData.labels && Array.isArray(parsedData.labels)) 
    ? parsedData.labels 
    : defaultTimeLabels;
    
  const myData = (parsedData && parsedData.data && Array.isArray(parsedData.data)) 
    ? parsedData.data 
    : defaultMyData;

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "나",
        data: myData,
        backgroundColor: "rgb(255,100,25,0.5)",
        borderColor: "rgb(255,100,25,1)",
        borderWidth: 2,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return timeLabels[context[0].dataIndex];
          },
          label: (ctx: any) => {
            return `${ctx.dataset.label}: ${ctx.parsed.y} 건`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: false,
          text: '시간대'
        },
        grid: {
          display: false,
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: '활동 건수'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
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
      
      {/* 시간대 차트 메시지 정보 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">시간대 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>타입:</strong> {parsedData.type || 'N/A'}</div>
                <div><strong>전체 데이터:</strong> {JSON.stringify(parsedData, null, 2)}</div>
                <div><strong>라벨 타입:</strong> {Array.isArray(parsedData.labels) ? '배열' : typeof parsedData.labels}</div>
                <div><strong>데이터 타입:</strong> {Array.isArray(parsedData.data) ? '배열' : typeof parsedData.data}</div>
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>현재 라벨:</strong> [{timeLabels.join(', ')}]</div>
            <div><strong>현재 데이터:</strong> [{myData.join(', ')}]</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default MyTimeChart;