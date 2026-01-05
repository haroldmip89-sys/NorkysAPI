import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as API from "../api/carrito.js";
import { FiEye } from "react-icons/fi";

export function AdminCarts() {
  const [lista, setLista] = useState([]);
  const ESTADOS = ["Pendiente", "Pagado", "Enviado", "Cancelado"];
  const [estado, setEstado] = useState("Pendiente");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCarritosPorEstado(estado)
      .then((data) => {
        setLista(data);
      })
      .finally(() => setLoading(false));
  }, [estado]);
  const estadoColor = (estado) => {
    switch (estado) {
      case "Pagado":
        return "bg-green-100 text-green-700";
      case "Enviado":
        return "bg-blue-100 text-blue-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };
  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <div className="space-y-6 p-4">
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Administrar carritos
          </h2>
          <p className="text-sm text-gray-500">
            Gestión de pedidos por estado
          </p>
        </div>

        {/* FILTRO */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">
            Estado
          </label>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        {/* ESTADOS */}
        {loading && (
          <p className="text-sm text-gray-500">Cargando carritos…</p>
        )}

        {!loading && lista.length === 0 && (
          <p className="text-sm text-gray-500">
            No hay carritos en este estado.
          </p>
        )}

        {/* TABLA */}
        {!loading && lista.length > 0 && (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold">Contacto</th>
                  {/* <th className="px-4 py-3 text-left font-semibold">Dirección</th> */}
                  <th className="px-4 py-3 text-left font-semibold">Total</th>
                  {/* <th className="px-4 py-3 text-left font-semibold">Pago</th> */}
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {lista.map((carrito) => (
                  <tr
                    key={carrito.idCarrito}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium">
                      #{carrito.idCarrito}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(carrito.fechaCreacion).toLocaleString("sv-SE")}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {carrito.nombreCliente} {carrito.apellidoCliente}
                      <div className="text-xs text-gray-500">
                        DNI: {carrito.dni}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      <div>{carrito.emailCliente}</div>
                      <div className="text-xs">{carrito.telefono1}</div>
                    </td>

                    {/* <td className="px-4 py-3 text-gray-500">
                    <strong>{carrito.tituloDireccion}</strong>
                    <br />
                    {carrito.direccion}
                  </td> */}

                    <td className="px-4 py-3 font-medium">
                      S/ {carrito.total.toFixed(2)}
                    </td>

                    {/* <td className="px-4 py-3 text-gray-600">
                    {carrito.metodoPago ?? "-"}
                  </td> */}

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor(
                          carrito.estado
                        )}`}
                      >
                        {carrito.estado}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center margin-auto">
                      <div className="flex justify-center">
                        <Link
                          to={`/admin/carts/${carrito.idCarrito}`}
                          className="text-gray-600 hover:text-blue-600 transition"
                          title="Ver detalle"
                        >
                          <FiEye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
