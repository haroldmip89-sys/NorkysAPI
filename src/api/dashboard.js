const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = API_BASE_URL+"/api/dashboard";
// const API_URL = "http://localhost:5218/api/dashboard";
export const dashboardAPI = {

  // 1️⃣ Total vs Día(puedes poner  dias=8 para comparar el mismo dia la semana pasada)
  getVentasPorDia: async (dias = 7) => {
    const res = await fetch(`${API_URL}/ventas-por-dia?dias=${dias}`);
    if (!res.ok) throw new Error("Error al obtener ventas por día");
    return res.json();
  },

  // 2️⃣ Métodos de pago
  getMetodosPago: async () => {
    const res = await fetch(`${API_URL}/metodos-pago`);
    if (!res.ok) throw new Error("Error al obtener métodos de pago");
    return res.json();
  },

  // 3️⃣ Top productos vendidos (últimos N días)
  getTopProductosVendidos: async (dias = 30, top = 5) => {
    const res = await fetch(
      `${API_URL}/top-productos-vendidos?dias=${dias}&top=${top}`);
    if (!res.ok) {
      throw new Error("Error al obtener top productos vendidos");
    }
    return res.json();
  },

  // 4️⃣ Top productos por ganancia (últimos N días)
  getTopProductosGanancia: async (dias = 30, top = 5) => {
    const res = await fetch(
      `${API_URL}/top-productos-ganancia?dias=${dias}&top=${top}`
    );
    if (!res.ok) throw new Error("Error al obtener top ganancia");
    return res.json();
  },

  // 5️⃣ Top productos por ganancia por fecha
  getTopProductosGananciaPorFecha: async (fecha) => {
    const res = await fetch(
      `${API_URL}/top-productos-ganancia-fecha?fecha=${fecha}`
    );
    if (!res.ok) throw new Error("Error al obtener ganancia por fecha");
    return res.json();
  },

  // 6️⃣ Fechas disponibles, solo top = 15
  getFechasDisponibles: async (top = 15) => {
    const res = await fetch(`${API_URL}/fechas?top=${top}`);
    if (!res.ok) throw new Error("Error al obtener fechas");
    return res.json();
  },
  // KPIs
  getKpis: async (dias = 7) => {
  const res = await fetch(`${API_URL}/kpis?dias=${dias}`);
  if (!res.ok) {
    throw new Error("Error al obtener KPIs");
  }
  return res.json();
}
};
