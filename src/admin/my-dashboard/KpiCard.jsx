export function KpiCard({ label, value, color = "gray" }) {
  const colors = {
    green: {
      border: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-600"
    },
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600"
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600"
    },
    red: {
      border: "border-red-500",
      bg: "bg-red-50",
      text: "text-red-600"
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600"
    },
    gray: {
      border: "border-gray-300",
      bg: "bg-white",
      text: "text-gray-700"
    }
  };

  const c = colors[color] || colors.gray;

  return (
    <div
      className={`
        border-l-4 ${c.border}
        ${c.bg}
        rounded-lg p-4 shadow-sm
      `}
    >
      <p className={`text-sm mb-1 ${c.text}`}>
        {label}
      </p>

      <p className={`text-2xl font-bold ${c.text}`}>
        {value}
      </p>
    </div>
  );
}
