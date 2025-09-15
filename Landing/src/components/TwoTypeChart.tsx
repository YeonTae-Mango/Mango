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
  // 차트 데이터 (HTML 파일에서 가져온 데이터)
  const myData = [88, 35, 12, 15, 27, 40, 60, 80];
  const partnerData = [10, 70, 40, 30, 10, 10, 20, 30];
  
  // 최고값 찾기
  const myMaxIndex = myData.indexOf(Math.max(...myData));
  const partnerMaxIndex = partnerData.indexOf(Math.max(...partnerData));
  
  // 포인트 스타일 배열 생성
  const myPointRadius = myData.map((_, index) => index === myMaxIndex ? 8 : 4);
  const myPointHoverRadius = myData.map((_, index) => index === myMaxIndex ? 12 : 6);
  
  const partnerPointRadius = partnerData.map((_, index) => index === partnerMaxIndex ? 8 : 4);
  const partnerPointHoverRadius = partnerData.map((_, index) => index === partnerMaxIndex ? 12 : 6);

  const chartData = {
    labels: ['핫플형', '쇼핑형', '예술가형', '뷰티형', '여행가형', '자기계발형', '스포츠형', '집돌이형'],
    datasets: [
      {
        label: '나',
        data: myData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
        pointRadius: myPointRadius,
        pointHoverRadius: myPointHoverRadius,
        borderWidth: 2,
        fill: true
      },
      {
        label: '상대방',
        data: partnerData,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        pointBackgroundColor: 'rgb(255, 159, 64)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 159, 64)',
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
        min: 0,
        max: 100,
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Chart */}
      <div className="w-96 h-96">
        <Radar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default TwoTypeChart;
