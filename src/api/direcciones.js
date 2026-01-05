const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = API_BASE_URL+"/api/Direcciones";
//obtener todos por id usuario
export async function getAllById(id) {
  try {
    const res = await fetch(`${API_URL}/usuario/${id}`);
    if (!res.ok) throw new Error("Error al obtener la Lista de direcciones");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
//borrar direccion de la lista
export async function deleteDireccion(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (res.status === 404) throw new Error("Direccion no encontrado");

    return res.status === 204; // true si se borró
  } catch (error) {
    console.error(error);
    return false;
  }
}
//agregar direccion a la lista
export async function create(body) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Error al agregar la direccion");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
//obtener por id
export async function getById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Direccion no encontrada");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
//actualizar
export async function update(id, body) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Error al actualizar el ítem");
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//
