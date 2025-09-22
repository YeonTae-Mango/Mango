import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useWebViewMessage } from '../hooks/useWebViewMessage';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function MyThisMonthChart() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  // React Native WebView에서 메시지 수신
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('MyThisMonthChart에서 파싱된 데이터 수신:', data);
    console.log('data.type:', data.type);
    console.log('data.data:', data.data);
    setParsedData(data.data);
  });

  // 기본 차트 데이터 생성
  const defaultLabels = Array.from({ length: 31 }, (_, i) => {
    const d = (i + 1).toString().padStart(2, "0");
    return `${d}`;
  });

  // 기본 지난 달 데이터
  const defaultLastMonth = [
    8, 15, 28, 38, 40, 55, 60, 68, 72, 75,
    82, 90, 95, 100, 98, 102, 108, 112, 116, 120,
    124, 126, 128, 130, 132, 135, 138, 140, 150, 160,
    168
  ];

  // 기본 이번 달 데이터
  const defaultThisMonthRaw = [
    0, 2, 10, 22, 30, 33, 48, 52, 60, 65,
    78, 90, 96, 100, 104, 110, 114, 118, 120, 122,
    124, 126, 130
  ];
  const defaultThisMonth = defaultLabels.map((_, i) => (i < defaultThisMonthRaw.length ? defaultThisMonthRaw[i] : null));

  // 받은 데이터가 있으면 사용, 없으면 기본값 사용
  const labels = defaultLabels;
    
  const lastMonth = (parsedData && parsedData.lastMonth) 
    ? parsedData.lastMonth 
    : defaultLastMonth;
    
  const thisMonth = (parsedData && parsedData.thisMonthRaw) 
    ? parsedData.thisMonthRaw 
    : defaultThisMonth;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "이번 달",
        data: thisMonth,
        borderColor: "rgb(255,100,25,0.8)",
        backgroundColor: "rgb(255,100,25,0.2)",
        borderWidth: 4,
        pointRadius: 0,
        tension: 0.25,
        spanGaps: true,
        fill: false
      },
      {
        label: "지난 달",
        data: lastMonth,
        borderColor: "rgb(200,200,200)",
        backgroundColor: "rgba(200,200,200,0.2)",
        borderWidth: 4,
        pointRadius: 0,
        tension: 0.25,
        spanGaps: true,
        fill: false
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
        labels: { boxWidth: 18, boxHeight: 8 }
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => (ctx.parsed.y != null ? `${ctx.dataset.label}: ${ctx.parsed.y}만원` : "")
        }
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)", display: false },
        ticks: {
          callback: (value: any, index: number) =>
            (index === 0 || index === labels.length - 1 ? labels[index] : "")
        }
      },
      y: {
        title: { display: true, text: "(만원)" },
        grid: { color: "rgba(0,0,0,0.05)" },
        // suggestedMin: 0,
        // suggestedMax: 180,
        ticks: { stepSize: 40, callback: (v: any) => v }
      }
    },
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Chart */}
        <div className="w-96 h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 이번달 차트 메시지 정보 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">이번달 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>타입:</strong> {parsedData.type || 'N/A'}</div>
                <div><strong>오늘 인덱스:</strong> {parsedData.todayIndex || 'N/A'}</div>
                <div><strong>지난달 데이터 타입:</strong> {Array.isArray(parsedData.lastMonth) ? '배열' : typeof parsedData.lastMonth}</div>
                <div><strong>이번달 데이터 타입:</strong> {Array.isArray(parsedData.thisMonthRaw) ? '배열' : typeof parsedData.thisMonthRaw}</div>
                <div><strong>전체 데이터:</strong> {JSON.stringify(parsedData, null, 2)}</div>
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>현재 라벨 수:</strong> {labels.length}개</div>
            <div><strong>이번달 데이터 수:</strong> {JSON.stringify(thisMonth)}</div>
            <div><strong>지난달 데이터 수:</strong> {lastMonth.length}개</div>
            {parsedData && parsedData.todayIndex && (
              <div><strong>오늘은:</strong> {parsedData.todayIndex + 1}일째</div>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default MyThisMonthChart;
