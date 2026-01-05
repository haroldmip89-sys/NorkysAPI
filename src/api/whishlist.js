const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = API_BASE_URL+"/api/WishListItem";
//obtener todos por id usuario
export async function getAllById(id) {
  try {
    const res = await fetch(`${API_URL}/usuario/${id}`);
    if (!res.ok) throw new Error("Error al obtener la Lista de deseos");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
//borrar item de la lista de deseos
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
//agregar item a la lista de deseos
export async function createItem(body) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Error al agregar el ítem");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
