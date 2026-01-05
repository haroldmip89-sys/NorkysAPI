import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function MetodosPagoChart({ data }) {
  const filtered = data.filter(x => x.metodoPago);

  const chartData = {
    labels: filtered.map(x => x.metodoPago),
    datasets: [
      {
        data: filtered.map(x => x.cantidad),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ]
      }
    ]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" // 👈 aquí
      }
    }
  };
  return <Pie data={chartData} options={options} />;
}
