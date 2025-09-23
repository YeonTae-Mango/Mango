import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useWebViewMessage } from '../hooks/useWebViewMessage';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TwoKeywordChart() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('TwoKeywordChart에서 파싱된 데이터 수신:', data);
    setParsedData(data.data || data);
  });

  // 기본 데이터 (인당 3개씩 총 6개 키워드)
  const defaultMyData = [95, 87, 75, 0, 0, 0];
  const defaultYourData = [0, 0, 0, 65, 48, 42];
  const defaultKeywordLabels = ["#쇼핑러버", "#맛집탐방", "#문화생활", "#여행가", "#운동매니아", "#카페애호가"];

  // 받은 데이터가 있으면 사용, 없으면 기본값 사용
  const myData = (parsedData && parsedData.myData && Array.isArray(parsedData.myData)) 
    ? parsedData.myData 
    : defaultMyData;

  const yourData = (parsedData && parsedData.yourData && Array.isArray(parsedData.yourData)) 
    ? parsedData.yourData 
    : defaultYourData;

  const keywordLabels = (parsedData && parsedData.labels && Array.isArray(parsedData.labels)) 
    ? parsedData.labels 
    : defaultKeywordLabels;

  const chartData = {
    labels: keywordLabels,
    datasets: [
      {
        label: "나",
        data: myData.map((value: number) => value === 0 ? null : value),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        borderRadius: {
          topLeft: 0,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 4
        },
        borderSkipped: false,
      },
      {
        label: "상대",
        data: yourData.map((value: number) => value === 0 ? null : value),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: {
          topLeft: 0,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 4
        },
        borderSkipped: false,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // 수평 막대 차트
    plugins: {
      legend: {
        position: "top" as const,
        display: false
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return keywordLabels[context[0].dataIndex];
          },
          label: (ctx: any) => {
            return `${ctx.dataset.label}: ${ctx.parsed.x}점`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: false,
          text: '점수'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        title: {
          display: false,
          text: '키워드'
        },
        grid: {
          display: false
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
      
      {/* 디버깅용 메시지 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">키워드 비교 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>전체 데이터:</strong> {JSON.stringify(parsedData, null, 2)}</div>
                <div><strong>키워드 라벨 개수:</strong> {keywordLabels.length}</div>
                <div><strong>내 데이터 개수:</strong> {myData.length}</div>
                <div><strong>상대 데이터 개수:</strong> {yourData.length}</div>
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>키워드 라벨:</strong> [{keywordLabels.join(', ')}]</div>
            <div><strong>내 데이터:</strong> [{myData.join(', ')}]</div>
            <div><strong>상대 데이터:</strong> [{yourData.join(', ')}]</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TwoKeywordChart;