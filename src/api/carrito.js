const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = API_BASE_URL+"/api/Carrito";

// GET carritos de un usuario
export const getCarritosByUsuario = async (idUsuario) => {
  const res = await fetch(`${API_URL}/usuario/${idUsuario}`);
  if (!res.ok) throw new Error("Usuario o carritos no encontrados");
  return res.json();
};

// GET detalles de un carrito
export const getCarritoDetalles = async (idCarrito) => {
  const res = await fetch(`${API_URL}/detalle/${idCarrito}`);
  if (!res.ok) throw new Error("Carrito no encontrado");
  return res.json();
};

// POST crear carrito
export const crearCarrito = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear carrito");
  return res.json(); // devuelve { IdCarrito: ... }
};

// PUT actualizar estado
export const cambiarEstado = async (idCarrito, estado) => {
  const res = await fetch(`${API_URL}/estado/${idCarrito}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(estado),
  });

  if (!res.ok) throw new Error("Error al cambiar estado");
  return true;
};
// PUT actualizar metodo de pago
export const actualizarMetodoPago = async (idCarrito, metodoPago) => {
  const res = await fetch(`${API_URL}/metodoPago/${idCarrito}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metodoPago),
  });
  if (!res.ok) throw new Error("Error al actualizar método de pago");
  return true;
}

// DELETE eliminar carrito
export const deleteCarrito = async (idCarrito) => {
  const res = await fetch(`${API_URL}/${idCarrito}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Carrito no encontrado");
  return true;
};

// GET carrito completo con detalles
export const getCarritoCompleto = async (idCarrito) => {
  const res = await fetch(`${API_URL}/detalle/${idCarrito}`);
  if (!res.ok) throw new Error("Carrito no encontrado");
  return res.json();
};
// GET carritos por estado
export const getCarritosPorEstado = async (estado) => {
  if (!estado) throw new Error("Debe enviar el estado");

  const res = await fetch(`${API_URL}?estado=${encodeURIComponent(estado)}`);

  if (res.status === 404) {
    return []; // no hay resultados, evita romper la UI
  }

  if (!res.ok) {
    throw new Error("Error al obtener carritos por estado");
  }

  return res.json();
};
