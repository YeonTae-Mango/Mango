import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function MyCategory() {
  // 차트 데이터 (HTML 파일에서 가져온 데이터)
  const chartData = {
    labels: ['공연/전시', '미디어/통신', '생활서비스', '소매/유통', '여가/오락', '음식', '학문/교육'],
    datasets: [
      {
        data: [103000, 432000, 223000, 1181000, 668000, 768000, 268000],
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255, 159, 64)',
          'rgba(199, 199, 199)'
        ],
        hoverOffset: 40,
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
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.parsed.toLocaleString() + '원';
          }
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Chart */}
      <div className="w-96 h-96">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default MyCategory;