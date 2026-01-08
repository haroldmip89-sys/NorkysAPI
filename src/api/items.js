const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/Item`;

// ----------------------------------------------------------------------
// Obtener todos los ítems
// ----------------------------------------------------------------------
export async function getItems() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener los ítems");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Obtener ítem por ID
// ----------------------------------------------------------------------
export async function getItemById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Item no encontrado");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Crear ítem
// body = { nombre, descripcion, precio, imagenUrl, idCategoria }
// ----------------------------------------------------------------------
export async function createItem(formData) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData // 👈 NO headers
    });

    if (!res.ok) throw new Error("Error al crear el ítem");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Actualizar ítem
// body = { nombre, descripcion, precio, imagenUrl }
// ----------------------------------------------------------------------
export async function updateItem(id, formData) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData
    });

    if (!res.ok) throw new Error("Error al actualizar el ítem");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
// ----------------------------------------------------------------------
// Eliminar ítem
// ----------------------------------------------------------------------
export async function deleteItem(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (res.status === 404) throw new Error("Ítem no encontrado");

    return res.status === 204; // true si se borró
  } catch (error) {
    console.error(error);
    return false;
  }
}

// ----------------------------------------------------------------------
// Obtener ítems por IDCategoria
// ----------------------------------------------------------------------
export async function getItemsByCategoria(idCategoria) {
  try {
    const res = await fetch(`${API_URL}/categoria/${idCategoria}`);
    if (!res.ok) throw new Error("Error al obtener los ítems por categoría");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
