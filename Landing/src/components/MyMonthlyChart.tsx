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
  // 차트 데이터 (HTML 파일에서 가져온 데이터)
  const chartData = {
    labels: ['5월', '6월', '7월', '8월', '9월'],
    datasets: [
      {
        data: [203000, 232000, 223000, 281000, 268000],
        borderColor: 'rgb(75, 192, 192, 0.7)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Chart */}
        <div className="w-96 h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default MyMonthlyChart;
