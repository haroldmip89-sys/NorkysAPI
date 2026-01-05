import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Cargar carrito desde localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar carrito cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // TOTAL DE ITEMS (SUMA DE UNIDADES)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Función para agregar un ítem al carrito
  const addToCart = (item, quantity) => {
    //bloquear admins
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    // 🚫 SOLO bloquear si es admin
    if (usuario && usuario.esAdmin === true) {
      Swal.fire({
        title: "Acceso restringido",
        text: "Los administradores no pueden agregar productos al carrito",
        icon: "error",
      });
      return;
    }
    setCart((prev) => {
      const exists = prev.find((p) => p.idItem === item.idItem);
      if (exists) {
        return prev.map((p) =>
          p.idItem === item.idItem
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prev, { ...item, quantity }];
    });
    Swal.fire({
      title: "Éxito",
      text: `Item ${item.nombre} x ${quantity} agregado(s)`,
      icon: "success",
    });
  };

  // Aumentar cantidad
  const increase = (idItem) => {
    setCart((prev) =>
      prev.map((item) =>
        item.idItem === idItem
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Disminuir cantidad
  const decrease = (idItem) => {
    setCart((prev) =>
      prev.map((item) =>
        item.idItem === idItem
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  // Eliminar del carrito
  const removeItem = (idItem) => {
    setCart((prev) => prev.filter((item) => item.idItem !== idItem));
    Swal.fire({
      title: "Éxito",
      text: "El item ha sido eliminado correctamente",
      icon: "success",
    });
    // toast.info("🗑 Item eliminado");
  };

  //Limpiar carrito
  const clearCart = () => {
    setCart([]);
    Swal.fire({
      title: "Éxito",
      text: "El carrito se ha limpiado",
      icon: "success",
    });
  };
  const clearCartSilent = () => {
    setCart([]); // sin toast
  };

  // Proveer el estado y las funciones del carrito a los componentes hijos
  return (
    <CartContext.Provider value={{ cart, addToCart, increase, decrease, removeItem, clearCart, clearCartSilent, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}
// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);

