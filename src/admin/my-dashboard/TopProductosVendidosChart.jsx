import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export function TopProductosVendidosChart({ data }) {
  const chartData = {
    labels: data.map(x => x.nombre),
    datasets: [
      {
        label: "Cantidad Vendida",
        data: data.map(x => x.totalVendido),
        backgroundColor: [
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)"
      ]
      }
    ]
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false
  };

  return <Bar data={chartData} options={options} />;
}
