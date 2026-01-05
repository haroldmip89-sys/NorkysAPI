import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  // Revisamos si el carrito existe y no está vacío
  const cart = localStorage.getItem("cart");

  if (!cart || JSON.parse(cart).length === 0) {
    // Si no hay carrito o está vacío, redirigimos al usuario
    return <Navigate to="/no-permission" replace />;
  }
  // Si hay usuario, renderizamos el contenido protegido
  return children;
}
