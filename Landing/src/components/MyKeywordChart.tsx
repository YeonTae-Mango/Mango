import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function MyKeywordChart() {
  // 차트 데이터 (HTML 파일에서 가져온 데이터)
  const chartData = {
    labels: ['#서포터즈', '#메케닉', '#편의점러버', '#아티스트', '#탑건', '#트렌드세터'],
    datasets: [
      {
        data: [80, 70, 55, 44, 43, 22],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
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
        max: 100,
        grid: {
          display: true
        }
      },
      y: {
        grid: {
          display: false
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
            return context.parsed.x.toLocaleString() + '점';
          }
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Chart */}
      <div className="w-96 h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default MyKeywordChart;
