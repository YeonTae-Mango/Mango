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

function TwoCategoryChart() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('TwoCategoryChart에서 파싱된 데이터 수신:', data);
    // React Native에서 여러 형태로 올 수 있으므로 유연하게 처리 (TwoKeywordChart와 동일)
    setParsedData(data.data || data);
  });

  // 기본 데이터
  const defaultLabels = ["학문/교육", "음식", "여가/오락", "소매/유통", "생활서비스", "미디어/통신", "공연/전시"];
  const defaultMyData = [-25, -18, -8, -6, -22, -28, -20];  // 음수로 왼쪽 표시
  const defaultYourData = [30, 15, 10, 8, 12, 25, 18];     // 양수로 오른쪽 표시

  // 받은 데이터가 있으면 사용, 없으면 기본값 사용
  const categoryLabels = (parsedData && parsedData.data.labels && Array.isArray(parsedData.data.labels)) 
    ? parsedData.data.labels 
    : defaultLabels;

  const myData = (parsedData && parsedData.data.myData && Array.isArray(parsedData.data.myData)) 
    ? parsedData.data.myData 
    : defaultMyData;

  const yourData = (parsedData && parsedData.data.partnerData && Array.isArray(parsedData.data.partnerData)) 
    ? parsedData.data.partnerData 
    : defaultYourData;

  // 동적 축 범위 계산 (대칭)
  const maxLeftValue = Math.max(...myData.map(Math.abs));
  const maxRightValue = Math.max(...yourData.map(Math.abs));
  const maxRange = Math.max(maxLeftValue, maxRightValue);
  const axisRange = Math.ceil(maxRange / 10) * 10; // 10 단위로 올림

  const chartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "나",
        data: myData,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius : 8,
        stack: 'stack1',
      },
      {
        label: "상대",
        data: yourData,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        borderRadius : 8,
        stack: 'stack1',
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
            return categoryLabels[context[0].dataIndex];
          },
          label: (ctx: any) => {
            const value = Math.abs(ctx.parsed.x);
            return `${ctx.dataset.label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        min: -axisRange,  // 동적 좌측 범위
        max: axisRange,   // 동적 우측 범위 (대칭)
        title: {
          display: false,
          text: '값'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          callback: function(value: any) {
            return Math.abs(value);
          }
        }
      },
      y: {
        stacked: true,
        title: {
          display: false,
          text: '카테고리'
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
        <div className="w-[600px] h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 디버깅용 메시지 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">카테고리 비교 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>전체 데이터:</strong> {JSON.stringify(parsedData, null, 2)}</div>
                <div><strong>카테고리 라벨 개수:</strong> {categoryLabels.length}</div>
                <div><strong>{JSON.stringify(parsedData.data.partnerData)}</strong></div>
                <div><strong>내 데이터 개수:</strong> {myData.length}</div>
                <div><strong>상대 데이터 개수:</strong> {yourData.length}</div>
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>카테고리 라벨:</strong> [{categoryLabels.join(', ')}]</div>
            <div><strong>내 데이터:</strong> [{myData.join(', ')}]</div>
            <div><strong>상대 데이터:</strong> [{yourData.join(', ')}]</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TwoCategoryChart;