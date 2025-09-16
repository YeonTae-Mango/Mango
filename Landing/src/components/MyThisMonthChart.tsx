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

function MyThisMonthChart() {
  // 차트 데이터 (HTML 파일에서 가져온 데이터)
  const labels = Array.from({ length: 31 }, (_, i) => {
    const d = (i + 1).toString().padStart(2, "0");
    return `01.${d}`;
  });

  // 지난 달(회색) 누적 값 예시 (단위: 만원)
  const lastMonth = [
    8, 15, 28, 38, 40, 55, 60, 68, 72, 75,
    82, 90, 95, 100, 98, 102, 108, 112, 116, 120,
    124, 126, 128, 130, 132, 135, 138, 140, 150, 160,
    168
  ];

  // 이번 달(초록) 누적 값 예시 — 중간까지만 값, 이후 null
  const thisMonthRaw = [
    0, 2, 10, 22, 30, 33, 48, 52, 60, 65,
    78, 90, 96, 100, 104, 110, 114, 118, 120, 122,
    124, 126, 110
  ];
  const thisMonth = labels.map((_, i) => (i < thisMonthRaw.length ? thisMonthRaw[i] : null));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "이번 달",
        data: thisMonth,
        borderColor: "rgb(0,170,120)",
        backgroundColor: "rgba(0,170,120,0.2)",
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
        suggestedMin: 0,
        suggestedMax: 180,
        ticks: { stepSize: 40, callback: (v: any) => v }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Chart */}
      <div className="w-96 h-96">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default MyThisMonthChart;
