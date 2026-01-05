const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/Item`;

// ----------------------------------------------------------------------
// Obtener todos los ítems
// ----------------------------------------------------------------------
export async function getItems() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("getItems:", error);
    return []; // 🔑 NUNCA null
  }
}

// ----------------------------------------------------------------------
// Obtener ítem por ID
// ----------------------------------------------------------------------
export async function getItemById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("getItemById:", error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Crear ítem
// ----------------------------------------------------------------------
export async function createItem(formData) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    return await res.json();
  } catch (error) {
    console.error("createItem:", error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Actualizar ítem
// ----------------------------------------------------------------------
export async function updateItem(id, formData) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    return await res.json();
  } catch (error) {
    console.error("updateItem:", error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Eliminar ítem
// ----------------------------------------------------------------------
export async function deleteItem(id) {
  try {
    c
