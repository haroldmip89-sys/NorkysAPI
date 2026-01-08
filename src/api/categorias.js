const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = API_BASE_URL+"/api/categoria";

// ----------------------------------------------------------------------
// Obtener todas las categorías
// ----------------------------------------------------------------------
export async function getCategorias() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener las categorías");
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// ----------------------------------------------------------------------
export const actualizarCategoria = async (id, nombre) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nombre),
  });

  if (!res.ok) throw new Error("Error al actualizar categoría");
};
export const getCategoriaById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) throw new Error("Categoría no encontrada");

  return await res.json();
};
