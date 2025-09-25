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
import { useState } from 'react';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function TwoTimeChart() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('TwoTimeChart에서 파싱된 데이터 수신:', data);
    // React Native에서 여러 형태로 올 수 있으므로 유연하게 처리
    setParsedData(data.data || data);
  });

  // 기본 데이터
  const defaultMyData = [16, 71, 62, 31];
  const defaultYourData = [10, 75, 49, 46];
  const defaultTimeLabels = ["06시", "12시", "18시", "24시"];

  // 받은 데이터가 있으면 사용, 없으면 기본값 사용
  const myData = (parsedData && parsedData.data.myData && Array.isArray(parsedData.data.myData)) 
    ? parsedData.data.myData 
    : defaultMyData;

  const yourData = (parsedData && parsedData.data.yourData && Array.isArray(parsedData.data.yourData)) 
    ? parsedData.data.yourData 
    : defaultYourData;

  const timeLabels = (parsedData && parsedData.timeLabels && Array.isArray(parsedData.timeLabels)) 
    ? parsedData.timeLabels 
    : defaultTimeLabels;

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "나",
        data: myData,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
      },
      {
        label: "상대",
        data: yourData,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
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
          display: true,
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        beginAtZero: true,
        // max: 30,
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
      
      {/* 디버깅용 메시지 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">시간대 비교 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>전체 데이터:</strong> {JSON.stringify(parsedData.data, null, 2)}</div>
                <div><strong>핫타임:</strong> {parsedData.hotTime || "정보 없음"}</div>
                <div><strong>시간 라벨 개수:</strong> {timeLabels.length}</div>
                <div><strong>내 데이터 개수:</strong> {myData.length}</div>
                <div><strong>상대 데이터 개수:</strong> {yourData.length}</div>
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>시간 라벨:</strong> [{timeLabels.join(', ')}]</div>
            <div><strong>내 데이터:</strong> [{myData.join(', ')}]</div>
            <div><strong>상대 데이터:</strong> [{yourData.join(', ')}]</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TwoTimeChart;
