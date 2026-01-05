import { useState, useEffect } from 'react';
import { dashboardAPI } from "../api/dashboard.js";
import { VentasPorDiaChart } from "./my-dashboard/VentasPorDiaChart.jsx";
import { MetodosPagoChart } from "./my-dashboard/MetodosPagoChart.jsx";
import { TopProductosVendidosChart } from "./my-dashboard/TopProductosVendidosChart.jsx";
import { TopProductosGananciaChart } from "./my-dashboard/TopProductosGananciaChart.jsx";
import { TopGananciaFechaChart } from "./my-dashboard/TopGananciaFechaChart.jsx";
import { KpiCard } from "./my-dashboard/KpiCard";

export function Dashboards() {
    const [ventasPorDia, setVentasPorDia] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]);
    const [topProductosVendidos, setTopProductosVendidos] = useState([]);
    const [topProductosGanancia, setTopProductosGanancia] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [topGananciaFecha, setTopGananciaFecha] = useState([]);
    const [kpis, setKpis] = useState(null);

    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDashboard();
    }, []);
    useEffect(() => {
        if (!fechaSeleccionada) return;

        dashboardAPI
            .getTopProductosGananciaPorFecha(fechaSeleccionada)
            .then(setTopGananciaFecha)
            .catch(err =>
                console.error("Error cargando ganancia por fecha:", err)
            );

    }, [fechaSeleccionada]);

    async function cargarDashboard() {
        try {
            setLoading(true);

            const [
                ventas,
                pagos,
                productosvendidos,
                productosGanancia,
                fechasDisponibles,
                kpisData
            ] = await Promise.all([
                dashboardAPI.getVentasPorDia(7),
                dashboardAPI.getMetodosPago(),
                dashboardAPI.getTopProductosVendidos(30, 5),
                dashboardAPI.getTopProductosGanancia(30, 5),
                dashboardAPI.getFechasDisponibles(), // QUERY 6
                dashboardAPI.getKpis(7)
            ]);

            setVentasPorDia(ventas);
            setMetodosPago(pagos);
            setTopProductosVendidos(productosvendidos);
            setTopProductosGanancia(productosGanancia);
            setFechas(fechasDisponibles);
            setKpis(kpisData);

            // Selecciona la primera fecha por defecto
            if (fechasDisponibles.length > 0) {
                setFechaSeleccionada(fechasDisponibles[0].fecha);
            }

        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p>Cargando dashboard...</p>;
    }

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Dashboard Administrador
                </h1>
                <p className="text-sm text-gray-500">
                    Resumen general del negocio
                </p>
            </div>

            {/* KPIs */}
            {kpis && (
                <section>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">
                        Indicadores generales
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard
                            label="Ventas pagadas (7-d)"
                            value={`S/ ${kpis.ventasPagadasUltimosDias.toFixed(2)}`}
                            color="green"
                        />
                        <KpiCard
                            label="Pendiente por cobrar"
                            value={`S/ ${kpis.totalPendienteCobro.toFixed(2)}`}
                            color="yellow"
                        />

                        <KpiCard
                            label="Ventas pagadas hoy"
                            value={`S/ ${kpis.ventasPagadasHoy.toFixed(2)}`}
                            color="blue"
                        />

                        <KpiCard
                            label="Ticket promedio"
                            value={`S/ ${kpis.ticketPromedioUltimosDias.toFixed(2)}`}
                            color="purple"
                        />

                        <KpiCard
                            label="Carritos pagados"
                            value={kpis.carritosPagadosUltimosDias}
                            color="green"
                        />

                        <KpiCard
                            label="Carritos pendientes"
                            value={kpis.carritosPendientesUltimosDias}
                            color="yellow"
                        />
                        <KpiCard
                            label="Pedidos hoy"
                            value={kpis.pedidosHoy}
                            color="blue"
                        />

                        <KpiCard
                            label="Carritos cancelados"
                            value={kpis.carritosCanceladosUltimosDias}
                            color="red"
                        />

                        
                    </div>
                </section>
            )}

            {/* GRÁFICOS */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 🔥 ESTE OCUPA TODA LA FILA */}
                <DashboardCard title="Ventas por día (últimos 7 días)" full color='blue'>
                    <VentasPorDiaChart data={ventasPorDia} />
                </DashboardCard>

                <DashboardCard title="Métodos de pago" color='red'>
                    <MetodosPagoChart data={metodosPago} />
                </DashboardCard>

                <DashboardCard title="Top productos más vendidos" color='yellow'>
                    <TopProductosVendidosChart data={topProductosVendidos} />
                </DashboardCard>

                <DashboardCard title="Top productos por ganancia (30 días)" full color='green'>
                    <TopProductosGananciaChart data={topProductosGanancia} />
                </DashboardCard>

            </section>

            <DashboardCard
                title="Ganancia por fecha"
                headerExtra={
                    <select
                        value={fechaSeleccionada}
                        onChange={e => setFechaSeleccionada(e.target.value)}
                        className="border rounded-md px-3 py-1.5 text-sm"
                    >
                        {fechas.map((f, i) => (
                            <option key={i} value={f.fecha}>
                                {f.fecha.split("T")[0]}
                            </option>
                        ))}
                    </select>
                }
                color='gray'
            >
                <TopGananciaFechaChart data={topGananciaFecha} />
            </DashboardCard>

        </div>
    );
}

/* =========================
   CARD REUTILIZABLE
========================= */
function DashboardCard({ title, children, headerExtra, full = false ,color="white"}) {
    return (
        <div
            className={`
        bg-${color}-50  shadow-sm p-6
        ${full ? "lg:col-span-2" : ""}
      `}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                    {title}
                </h3>
                {headerExtra}
            </div>

            {/* BODY (altura controlada) */}
            <div className="h-[250px]">
                {children}
            </div>
        </div>
    );
}
