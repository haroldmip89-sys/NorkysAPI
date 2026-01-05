import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";

export function CartFinished() {
    const { state } = useLocation();
    const { total/*, idCarrito*/, metodoPago } = state || {};
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-norkys-verde">Compra Finalizada 🎉</h1>
          {metodoPago && (
            <p className="text-gray-700">
              <strong>Método de pago:</strong> {metodoPago}
            </p>
          )}
          {total !== undefined && (
            <p className="text-gray-700">
              <strong>Total pagado:</strong> S/ {total.toFixed(2)}
            </p>
          )}

          <p className="text-gray-600">
            Gracias por su compra. Su orden ha sido procesada exitosamente.
          </p>
          <p className="text-gray-600 text-sm">
            Tienes un plazo de 24 hrs para enviar tu comprobante de pago, de lo contrario, la orden se cancelará automáticamente.
          </p>

          <a 
            href="https://wa.me/51949034651?text=Hola,%20adjunto%20mi%20comprobante" 
            target="_blank"
            className="block"
          >
            <button className="w-full norkys-bg-verde hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow transition">
              Enviar Comprobante por WhatsApp
            </button>
          </a>

          <Link 
            to={"/"} 
            className="text-sm text-gray-500 hover:text-norkys-verde transition block mt-4"
          >
            ← Volver al listado
          </Link>
        </div>
      </main>

      <Footer />
    </div>
    );
}