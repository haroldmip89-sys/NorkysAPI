import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Maps } from "../components/Maps.jsx";
import * as API from '../api/carrito.js';
import { FiSave, FiArrowLeft } from "react-icons/fi";

export function EditCart() {
    let { id } = useParams();
    const [estado, setEstado] = useState("");
    const [metodoPago, setMetodoPago] = useState("");
    const [saving, setSaving] = useState(false);

    const [carrito, setCarrito] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialPosition, setInitialPosition] = useState(null);

    useEffect(() => {
        // carrito.estado: para ver el estado, carrito.items.idItem: para ver los items)
        API.getCarritoCompleto(id)
            .then(data => {
                setCarrito(data);

                setEstado(data.estado);
                setMetodoPago(data.metodoPago ?? "");

                if (data.latY && data.longX) {
                    setInitialPosition({
                        lat: data.latY,
                        lng: data.longX
                    });
                }
            })

            .catch(error => {
                console.error("Error al obtener los detalles del carrito:", error);
            })
            .finally(() => setLoading(false)
            );
    }, [id]);

    const handleGuardarCambios = async () => {
        try {
            setSaving(true);

            // Solo actualizar si cambió
            if (estado !== carrito.estado) {
                await API.cambiarEstado(id, estado);
            }

            if (metodoPago !== carrito.metodoPago) {
                await API.actualizarMetodoPago(id, metodoPago);
            }

            // Refrescar estado local
            setCarrito(prev => ({
                ...prev,
                estado,
                metodoPago
            }));
            Swal.fire({
                    title: "Éxito",
                    text: "Cambios guardados correctamente",
                    icon: "success",
                });
            //alert("Cambios guardados correctamente");
        } catch (error) {
            console.error(error);
            Swal.fire({
                    title: "Error",
                    text: "Error al guardar los cambios",
                    icon: "error",
                });
        } finally {
            setSaving(false);
        }
    };

    // si loading es true, mostrar cargando
    if (loading) {
        return <p>Cargando carrito...</p>;
    }
    //si carrito es null, mostrar error
    if (!carrito) {
        return <p>No se pudo cargar el carrito.</p>;
    }
    return (
        <div className="space-y-8 p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Editar Carrito #{id}
          </h2>
          <p className="text-sm text-gray-500">
            Gestión del pedido y datos del cliente
          </p>
        </div>

        <Link
          to="/admin/carts"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <FiArrowLeft /> Volver
        </Link>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid gap-8 lg:grid-cols-3">

        {/* IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">

          {/* DATOS CLIENTE */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Datos del cliente
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <p><b>Correo:</b> {carrito.emailCliente}</p>
              <p><b>DNI:</b> {carrito.dni ?? "No definido"}</p>
              <p className="sm:col-span-2">
                <b>Nombre:</b> {carrito.nombreCliente} {carrito.apellidoCliente}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Productos del carrito
            </h3>

            {carrito.items.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay productos en este carrito.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Producto</th>
                      <th className="px-4 py-3 text-center">Cantidad</th>
                      <th className="px-4 py-3 text-right">Precio</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {carrito.items.map(item => (
                      <tr key={item.idItem}>
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img
                            src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                            className="w-12 h-12 object-contain"
                          />
                          {item.nombreItem}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item.cantidad}
                        </td>

                        <td className="px-4 py-3 text-right">
                          S/ {item.precioUnitario}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          S/ {item.subtotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* MAPA */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Ubicación del cliente
            </h3>

            <div className="h-[300px] rounded-lg overflow-hidden">
              <Maps initialPosition={initialPosition} readOnly />
            </div>
          </div>

        </div>

        {/* DERECHA */}
        <div className="bg-gray-50 rounded-xl p-6 h-fit space-y-4">

          <h3 className="text-sm font-semibold text-gray-700">
            Estado del pedido
          </h3>

          <div className="space-y-3 text-sm">
            <label className="block">
              Estado
              <select
                value={estado}
                onChange={e => setEstado(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Enviado">Enviado</option>
                <option value="Pagado">Pagado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </label>

            <label className="block">
              Método de pago
              <select
                value={metodoPago}
                onChange={e => setMetodoPago(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="">No definido</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </label>
          </div>

          <hr />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>S/ {carrito.total}</span>
          </div>

          <button
            onClick={handleGuardarCambios}
            disabled={saving}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            <FiSave />
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>

      </div>
    </div>
    );
}