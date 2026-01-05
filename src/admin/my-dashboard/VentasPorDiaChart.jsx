import { Bar } from "react-chartjs-2";
import { Chart  } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler 
);

export function VentasPorDiaChart({ data }) {
  const chartData = {
    labels: data.map(x => x.dia.split("T")[0]),
    datasets: [
      {
        label: "Total Ventas",
        data: data.map(x => x.totalVentas),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        barThickness: 40,          // fijo
        maxBarThickness: 40,       // máximo  
        tension: 0.0,       // curva suave
        fill: false,
        pointRadius: 4      
      }
    ]  
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true } }
    },
  };

  return (
    <Chart
      type="line"   // 🔥 aquí decides: "bar" o "line"
      data={chartData}
      options={options}
    />
  );
}
