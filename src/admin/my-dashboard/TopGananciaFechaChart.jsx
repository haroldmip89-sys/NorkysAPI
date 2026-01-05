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

export function TopGananciaFechaChart({ data }) {
  const chartData = {
    labels: data.map(x => x.nombre),
    datasets: [
      {
        label: "Ganancia(S/.)",
        data: data.map(x => x.ganancia),
        backgroundColor: [
        "rgba(255, 206, 86, 0.6)",
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
