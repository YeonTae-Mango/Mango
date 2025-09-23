import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useWebViewMessage } from '../hooks/useWebViewMessage';
import { useState } from 'react';

// Chart.js 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function TwoTypeChart() {
  const [parsedData, setParsedData] = useState<any>(null);
  
  const { receivedMessage } = useWebViewMessage((data) => {
    console.log('TwoTypeChart에서 파싱된 데이터 수신:', data);
    setParsedData(data.data);
  });

  // 기본 데이터
  const defaultLabels = ["예술가형", "뷰티형", "음식", "집돌이형", "핫플형", "자기계발형", "쇼핑형", "스포츠형", "여행가형"];
  const defaultMyData = [10, 16, 0, 7, 16, 12, 10, 16, 13];
  const defaultPartnerData = [11, 16, 0, 7, 19, 11, 11, 10, 15];

  // 받은 데이터가 있으면 사용, 없으면 기본값 사용
  const chartLabels = (parsedData && parsedData.labels) 
    ? parsedData.labels 
    : defaultLabels;

  const myData = (parsedData && parsedData.myData) 
    ? parsedData.myData 
    : defaultMyData;

  const partnerData = (parsedData && parsedData.partnerData) 
    ? parsedData.partnerData 
    : defaultPartnerData;
  
  // 최고값 찾기
  const myMaxIndex = myData.indexOf(Math.max(...myData));
  const partnerMaxIndex = partnerData.indexOf(Math.max(...partnerData));
  
  // 포인트 스타일 배열 생성
  const myPointRadius = myData.map((_: number, index: number) => index === myMaxIndex ? 8 : 4);
  const myPointHoverRadius = myData.map((_: number, index: number) => index === myMaxIndex ? 12 : 6);
  
  const partnerPointRadius = partnerData.map((_: number, index: number) => index === partnerMaxIndex ? 8 : 4);
  const partnerPointHoverRadius = partnerData.map((_: number, index: number) => index === partnerMaxIndex ? 12 : 6);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: '나',
        data: myData,
        borderColor: 'rgba(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'rgba(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235)',
        pointRadius: myPointRadius,
        pointHoverRadius: myPointHoverRadius,
        borderWidth: 2,
        fill: true
      },
      {
        label: '상대방',
        data: partnerData,
        borderColor: 'rgba(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132)',
        pointRadius: partnerPointRadius,
        pointHoverRadius: partnerPointHoverRadius,
        borderWidth: 2,
        fill: true
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rect' as const,
          boxWidth: 12,
          boxHeight: 8
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + context.parsed.r;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        // min: 0,
        // max: 100,
        stepSize: 20,
        ticks: {
          stepSize: 20
        },
        grid: {
          display: true
        },
        angleLines: {
          display: true
        },
      }
    },
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Chart */}
        <div className="w-96 h-96">
          <Radar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 디버깅용 메시지 표시 */}
      {/* <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">유형 비교 차트 데이터 정보</h4>
          
          <div className="text-xs text-gray-600 break-words mb-3 bg-gray-50 p-2 rounded">
            <div><strong>받은 메시지:</strong> {receivedMessage || "메시지를 기다리는 중..."}</div>
          </div>
          
          <div className="text-xs text-blue-600 break-words bg-blue-50 p-2 rounded mb-2">
            {parsedData ? (
              <>
                <div><strong>전체 데이터:</strong> {JSON.stringify(parsedData, null, 2)}</div>
                <div><strong>라벨 개수:</strong> {JSON.stringify(parsedData.labels)}</div>
                <div><strong>내 데이터 개수:</strong> {myData.length}</div>
                <div><strong>상대 데이터 개수:</strong> {partnerData.length}</div>
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>현재 라벨:</strong> [{chartLabels.join(', ')}]</div>
            <div><strong>내 데이터:</strong> [{myData.join(', ')}]</div>
            <div><strong>상대 데이터:</strong> [{partnerData.join(', ')}]</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TwoTypeChart;
