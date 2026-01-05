import { Link } from "react-router-dom";
import { useState } from "react";
import yape from '../assets/yape.jpeg';
import scotia from '../assets/scotia.png';
import { useCart } from "../context/CarritoContext";
import * as API from "../api/carrito.js";
import { useNavigate } from "react-router-dom";
import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";
import { toast } from "react-toastify";
//componente para confirmar el carrito y seleccionar metodo de pago
export function CartConfirmed() {
  const { cart, clearCartSilent } = useCart();
  const navigate = useNavigate();
  const payload = JSON.parse(sessionStorage.getItem("payloadCarrito"));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity * item.precio, 0);
  const [metodoPago, setMetodoPago] = useState("Yape");
  const handleFinalizar = async () => {

    if (!payload) {
      alert("Error: no se encontró la información del carrito.");
      return;
    }

    // 1. Crear carrito
    const data = await API.crearCarrito(payload);
    const idCarrito = data.idCarrito;

    // 2. Actualizar método de pago
    await API.actualizarMetodoPago(idCarrito, metodoPago );
    Swal.fire({
      title: "Éxito",
      text: "Carrito enviado al sistema",
      icon: "success",
    });

    // 3. Limpiar
    sessionStorage.removeItem("payloadCarrito");

    //alert("Compra finalizada correctamente");
    clearCartSilent();
    navigate("/cart/cart-finished", {
      state: {
        total: totalItems,
        //idCarrito,
        metodoPago
      }
    });

  };
  //no deberia renderizar este component si el carrito esta vacio
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* TITULO PRINCIPAL */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Confirmación de Carrito
        </h1>

        {/* GRID RESPONSIVE */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* IZQUIERDA: Método de Pago */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Método de Pago</h2>
              <p className="text-gray-600 mb-2">Seleccione un método de pago para continuar:</p>

              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-norkys-verde mb-4"
              >
                <option value="Yape">Yape o Plin</option>
                <option value="Tarjeta">Transferencia</option>
              </select>

              {metodoPago === "Yape" ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">Instrucciones Yape/Plin:</h3>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Abra la aplicación de Yape o Plin en su teléfono móvil.</li>
                    <li>Seleccione la opción de escanear QR.</li>
                    <li>Escanee el código QR para realizar el pago:</li>
                  </ol>
                  <img src={yape} alt="Código QR Yape/Plin" className="w-80 mx-auto rounded-lg shadow-sm" />
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">Instrucciones Transferencia:</h3>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Acceda a la plataforma de su banco (app o web).</li>
                    <li>Seleccione la opción de transferencia bancaria.</li>
                    <li>Ingrese los datos proporcionados para completar la transferencia:</li>
                  </ol>
                  <img src={scotia} alt="Cuenta Scotia" className="w-80 mx-auto rounded-lg shadow-sm" />
                </div>
              )}

              <p className="text-gray-500 text-sm">Guarde el comprobante de pago una vez realizado.</p>
            </div>
          </section>

          {/* DERECHA: Resumen del carrito */}
          <aside className="bg-white rounded-xl shadow-md p-6 flex flex-col h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Resumen del Carrito</h2>

            <div className="space-y-4 overflow-y-auto flex-1">
              {cart.map(item => (
                <div key={item.idItem} className="flex items-center gap-4 border-b pb-2 last:border-none">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                    alt={item.nombre}
                    className="w-20 h-20 object-contain bg-gray-50 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-sm text-gray-500">S/ {item.precio} x {item.quantity}</p>
                  </div>
                  <p className="font-semibold">S/ {(item.precio * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6 text-lg font-bold">
              <span>Total a pagar:</span>
              <span className="text-norkys-naranja">S/ {totalItems}</span>
            </div>

            {/* BOTON STICKY */}
            <button
              onClick={handleFinalizar}
              className="mt-4 w-full text-white norkys-bg-verde hover:bg-green-500 font-semibold py-3 rounded-lg shadow transition"
            >
              Finalizar Compra
            </button>
          </aside>
        </div>

        {/* LINK VOLVER */}
        <div className="mt-5">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:norkys-text-verde transition"
          >
            ← Volver al listado
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}