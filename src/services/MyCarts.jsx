import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as API from "../api/carrito.js";
import { FiEye } from "react-icons/fi";

export function MyCarts() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const idUsuario = usuario.idUsuario;

  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      const cargar = async () => {
        setLoading(true);
        const data = await API.getCarritosByUsuario(idUsuario);
        setLista(data || []);
        setLoading(false);
      };
      cargar();
    }, []);

  return (
    <>
    
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Mis carritos
        </h2>
        <p className="text-sm text-gray-500">
          Historial de pedidos y carritos generados
        </p>
      </div>

      {/* ESTADOS */}
      {loading && (
        <p className="text-sm text-gray-500">Cargando carritos…</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* TABLA */}
      {lista.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold">Total</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-left font-semibold">Dirección</th>
                <th className="px-4 py-3 text-left font-semibold">Pago</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {lista.map(item => (
                <tr
                  key={item.idCarrito}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    #{item.idCarrito}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(item.fechaCreacion).toLocaleString("sv-SE")}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    S/ {item.total}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.estado}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {item.direccion}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.metodoPago}
                  </td>

                  <td className="px-4 py-3 text-right flex justify-center">
                    <Link
                      to={`/my-account/carts/${item.idCarrito}`}
                      className="text-gray-600 hover:text-blue-600 transition"
                      title="Ver detalle"
                    >
                      <FiEye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-sm text-gray-500">
            No tienes carritos registrados.
          </p>
        )
      )}
    </div>
    
    </>
  );
}
