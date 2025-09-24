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
  const defaultOtherData = [0, 0, 0, 65, 48, 42];
  const defaultKeywordLabels = ["#쇼핑러버", "#맛집탐방", "#문화생활", "#여행가", "#운동매니아", "#카페애호가"];

  // parsedData 구조 파악 및 데이터 처리
  let keywordLabels = defaultKeywordLabels;
  let myData = defaultMyData;
  let otherData = defaultOtherData;
  let debugInfo = null;

  if (parsedData) {
    try {
      // 내 키워드 데이터 추출 (상위 3개)
      const myKeywordData = parsedData.myData?.data?.data || parsedData.myData?.data || parsedData.myData || [];
      const myKeywords = parsedData.myData?.data?.labels || parsedData.myKeywords || [];
      
      // 상대 키워드 데이터 추출 (상위 3개)
      const otherKeywordData = parsedData.otherData?.data?.data || parsedData.yourData?.data || parsedData.yourData || [];
      const otherKeywords = parsedData.otherData?.data?.labels || parsedData.yourKeywords || [];
      
      // 상위 3개씩 추출
      const myTop3Data = Array.isArray(myKeywordData) ? myKeywordData.slice(0, 3) : [0, 0, 0];
      const myTop3Keywords = Array.isArray(myKeywords) ? myKeywords.slice(0, 3) : ['#키워드1', '#키워드2', '#키워드3'];
      
      const otherTop3Data = Array.isArray(otherKeywordData) ? otherKeywordData.slice(0, 3) : [0, 0, 0];
      const otherTop3Keywords = Array.isArray(otherKeywords) ? otherKeywords.slice(0, 3) : ['#키워드4', '#키워드5', '#키워드6'];
      
      // 라벨 합치기 (내 3개 + 상대 3개)
      keywordLabels = [...myTop3Keywords, ...otherTop3Keywords];
      
      // 데이터 배열 만들기
      // myData: [내 3개 값, 0, 0, 0]
      myData = [...myTop3Data, 0, 0, 0];
      
      // yourData: [0, 0, 0, 상대 3개 값]
      otherData = [0, 0, 0, ...otherTop3Data];
      
      // 디버그 정보 수집
      debugInfo = {
        myKeywordData,
        myKeywords,
        yourKeywordData: otherKeywordData,
        yourKeywords: otherKeywords,
        myTop3Data,
        myTop3Keywords,
        yourTop3Data: otherTop3Data,
        yourTop3Keywords: otherTop3Keywords
      };
      
    } catch (error) {
      // 에러 발생 시 기본값 사용
      keywordLabels = defaultKeywordLabels;
      myData = defaultMyData;
      otherData = defaultOtherData;
      debugInfo = { error: error instanceof Error ? error.message : '알 수 없는 에러' };
    }
  }

  const chartData = {
    labels: keywordLabels,
    datasets: [
      {
        label: "나",
        data: myData.map((value: number) => value === 0 ? null : value),
        backgroundColor: "rgba(54, 162, 235, 0.8)",  // 파란색 (원래 상대 색상)
        borderColor: "rgba(54, 162, 235, 1)",
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
        data: otherData.map((value: number) => value === 0 ? null : value),
        backgroundColor: "rgba(255, 99, 132, 0.8)",  // 빨간색 (원래 내 색상)
        borderColor: "rgba(255, 99, 132, 1)",
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
        // max: 100,
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
                <hr className="my-2 border-blue-200" />
                {debugInfo && !debugInfo.error && (
                  <>
                    <div><strong>📊 데이터 처리 과정:</strong></div>
                    <div><strong>내 원본 키워드 데이터:</strong> [{debugInfo.myKeywordData?.join?.(', ') || '없음'}]</div>
                    <div><strong>내 원본 키워드 라벨:</strong> [{debugInfo.myKeywords?.join?.(', ') || '없음'}]</div>
                    <div><strong>상대 원본 키워드 데이터:</strong> [{debugInfo.yourKeywordData?.join?.(', ') || '없음'}]</div>
                    <div><strong>상대 원본 키워드 라벨:</strong> [{debugInfo.yourKeywords?.join?.(', ') || '없음'}]</div>
                    <hr className="my-1 border-blue-200" />
                    <div><strong>내 상위 3개 데이터:</strong> [{debugInfo.myTop3Data?.join?.(', ')}]</div>
                    <div><strong>내 상위 3개 라벨:</strong> [{debugInfo.myTop3Keywords?.join?.(', ')}]</div>
                    <div><strong>상대 상위 3개 데이터:</strong> [{debugInfo.yourTop3Data?.join?.(', ')}]</div>
                    <div><strong>상대 상위 3개 라벨:</strong> [{debugInfo.yourTop3Keywords?.join?.(', ')}]</div>
                  </>
                )}
                {debugInfo?.error && (
                  <div className="text-red-600"><strong>❌ 에러:</strong> {debugInfo.error}</div>
                )}
                <hr className="my-2 border-blue-200" />
              </>
            ) : (
              "파싱된 데이터를 기다리는 중..."
            )}
          </div>
          
          <div className="text-xs text-green-600 break-words bg-green-50 p-2 rounded">
            <div><strong>키워드 라벨:</strong> [{keywordLabels.join(', ')}]</div>
            <div><strong>내 데이터:</strong> [{myData.join(', ')}]</div>
            <div><strong>상대 데이터:</strong> [{otherData.join(', ')}]</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TwoKeywordChart;