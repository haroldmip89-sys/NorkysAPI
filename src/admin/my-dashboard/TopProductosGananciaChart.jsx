import { Bar } from "react-chartjs-2";

export function TopProductosGananciaChart({ data }) {

  const chartData = {
    labels: data.map(x => x.nombre),
    datasets: [
      {
        label: "Ganancia (S/.)",
        data: data.map(x => x.ganancia),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        barThickness: 30
      }
    ]
  };

  const options = {
    indexAxis: "y", // horizontal
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: true } },
      y: { grid: { display: false } }
    }
  };

  return <Bar data={chartData} options={options} />;
}
