const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = API_BASE_URL+"/api/Usuario";

// Login
export const login = async (email, password) => {
    const res = await fetch(`${API_URL}/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        let message = "Credenciales incorrectas";
        try {
            const errJson = await res.json();
            if (errJson?.mensaje) message = errJson.mensaje;
        } catch {}

        return { ok: false, error: message };
    }

    const data = await res.json();
    return { ok: true, data };
};


// Crear usuario
export const createUser = async (data) => {
    const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
};

// Get usuario
export const getUsuario = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Usuario no encontrado");
    return res.json();
};

// Delete usuario
export const deleteUsuario = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo borrar usuario");
};

// Get all users
export const getUsuarios = async () => {
    const res = await fetch(`${API_URL}/Usuario`);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
};

// Ver si es admin
export const isAdmin = async (id) => {
    const res = await fetch(`${API_URL}/IsAdmin/${id}`);
    return res.json();
};
//actualizar usuario
export const updateUsuario = async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Error al actualizar usuario");
    }

    return true; // el backend devuelve boolean
};
