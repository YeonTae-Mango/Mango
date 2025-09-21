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

function TwoTimeChart() {
  // 차트 데이터 (HTML 파일에서 가져온 데이터)
  const myData = [4, 6, 25, 14, 12, 18, 20, 10];   // 나
  const yourData = [6, 3, 12, 20, 10, 9, 26, 22];  // 상대
  const timeLabels = ["03시", "06시", "09시", "12시", "15시", "18시", "21시", "24시"];

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "나",
        data: myData,
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
      },
      {
        label: "상대",
        data: yourData,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
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
        position: "top" as const
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
          display: true,
          text: '시간대'
        },
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        beginAtZero: true,
        max: 30,
        title: {
          display: true,
          text: '활동 건수'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Chart */}
        <div className="w-96 h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default TwoTimeChart;
