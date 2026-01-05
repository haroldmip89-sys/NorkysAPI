const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/categoria`;

/* =========================================================
   FETCH SEGURO PARA NGROK / APIs INESTABLES
========================================================= */
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "ngrok-skip-browser-warning": "true",
      ...(options.headers || {})
    }
  });

  const text = await res.text();

  // Validación: ngrok a veces devuelve HTML
  if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
    console.error("Respuesta NO JSON:", text);
    throw new Error("La API devolvió HTML en vez de JSON");
  }

  return JSON.parse(text);
}

/* =========================================================
   OBTENER TODAS LAS CATEGORÍAS
========================================================= */
export async function getCategorias() {
  try {
    return await fetchJSON(API_URL);
  } catch (error) {
    console.error("getCategorias:", error);
    return []; // 👈 SIEMPRE array
  }
}

/* =========================================================
   OBTENER CATEGORÍA POR ID
========================================================= */
export async function getCategoriaById(id) {
  try {
    return await fetchJSON(`${API_URL}/${id}`);
  } catch (error) {
    console.error("getCategoriaById:", error);
    return null;
  }
}

/* =========================================================
   ACTUALIZAR CATEGORÍA
========================================================= */
export async function actualizarCategoria(id, nombre) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({ nombre }) // 👈 CORRECTO
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error PUT:", text);
      throw new Error("Error al actualizar categoría");
    }

    return true;
  } catch (error) {
    console.error("actualizarCategoria:", error);
    return false;
  }
}
