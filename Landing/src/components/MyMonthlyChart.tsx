import React, { useState, useEffect } from 'react';
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

function MyMonthlyChart() {
  // 동적 데이터 상태 관리
  const [chartLabels, setChartLabels] = useState<string[]>(['5월', '6월', '7월', '8월', '9월']);
  const [chartDataValues, setChartDataValues] = useState<number[]>([203000, 232000, 223000, 281000, 268000]);
  const [parsedData, setParsedData] = useState<any>(null);

  // React Native WebView에서 메시지 수신
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('MyMonthlyChart에서 파싱된 데이터 수신:', data);
    console.log('data.type:', data.type);
    console.log('data.data:', data.data);
    setParsedData(data);
  });

  // 메시지 데이터가 변경될 때 차트 데이터 업데이트
  useEffect(() => {
    if (parsedData && parsedData.data) {
      try {
        // 월별 데이터 구조: {message, data: {label: ["4","5","6","7","8","9"], data: [1114300,1415700,848200,1311000,1320500,834600]}, status}
        if (parsedData.data.label && Array.isArray(parsedData.data.label)) {
          const monthLabels = parsedData.data.label.map((month: string) => `${month}월`);
          setChartLabels(monthLabels);
        }
        
        if (parsedData.data.data && Array.isArray(parsedData.data.data)) {
          setChartDataValues(parsedData.data.data);
        }
        
        console.log('Monthly chart data updated:', parsedData.data);
      } catch (error) {
        console.error('Error processing monthly chart data:', error);
      }
    }
  }, [parsedData]);

  // 동적 색상 계산 (React Native 앱과 동일한 색상 시스템)
  const getChartColors = () => {
    // Tailwind CSS 색상값과 일치시키기
    // React Native의 bg-orange-500와 동일한 색상 사용
    return {
      border: 'rgb(249, 115, 22)',      // Tailwind orange-500
      background: 'rgba(249, 115, 22, 0.3)'  // Tailwind orange-500 with transparency
    };
  };

  const colors = getChartColors();

  // Y축 범위 계산 (데이터 범위의 절반만큼 여백 추가)
  const calculateYAxisRange = () => {
    if (chartDataValues.length === 0) return { min: undefined, max: undefined };
    
    const minValue = Math.min(...chartDataValues);
    const maxValue = Math.max(...chartDataValues);
    const range = maxValue - minValue;
    const padding = range / 2;
    
    return {
      min: Math.max(0, minValue - padding), // 최소값은 0보다 작을 수 없음
      max: maxValue + padding
    };
  };

  const yAxisRange = calculateYAxisRange();

  // 차트 데이터
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues,
        borderColor: colors.border,
        backgroundColor: colors.background,
        fill: true,
        tension: 0.3,
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
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        min: yAxisRange.min,
        max: yAxisRange.max,
        ticks: {
          callback: function(value: any) {
            return (value / 10000).toLocaleString() + '만원';
          }
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
            return context.parsed.y.toLocaleString() + '원';
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
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 디버깅용 메시지 표시 */}
      {/* <div className="fixed bottom-4 left-4 bg-white p-4 rounded shadow-lg max-w-md">
        <h3 className="font-bold mb-2">WebView 메시지 (월별 차트)</h3>
        <div className="text-sm">
          <p><strong>받은 메시지:</strong> {receivedMessage || '없음'}</p>
          <p><strong>파싱된 데이터:</strong> {parsedData ? JSON.stringify(parsedData, null, 2) : '없음'}</p>
          <p><strong>현재 레이블:</strong> {JSON.stringify(chartLabels)}</p>
          <p><strong>현재 데이터:</strong> {JSON.stringify(chartDataValues)}</p>
        </div>
        

        <button 
          onClick={() => {
            const testData = {
              message: "월별 차트 테스트",
              data: {
                label: ["4","5","6","7","8","9"],
                data: [1114300,1415700,848200,1311000,1320500,834600]
              },
              status: "success"
            };
            
            // 메시지 이벤트 시뮬레이션
            const event = new MessageEvent('message', {
              data: JSON.stringify(testData)
            });
            window.dispatchEvent(event);
          }}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          테스트 메시지 전송
        </button>
      </div> */}
    </div>
  );
}

export default MyMonthlyChart;
