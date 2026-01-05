import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as API from "../api/categorias.js";
import { useNavigate } from "react-router-dom";

export function EditCategories() {
    const { id } = useParams();
    let navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        API.getCategoriaById(id)
            .then(data => {
                setCategoria(data);
                setNombre(data.nombre);
            })
            .catch(err => {
                console.error("Error al cargar categoría:", err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleGuardar = async () => {
        try {
            setSaving(true);

            if (nombre !== categoria.nombre) {
                await API.actualizarCategoria(id, { nombre });
            }

            Swal.fire({
                title: "Éxito",
                text: "Categoría actualizada correctamente",
                icon: "success",
            });
            navigate("/admin/categories");
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Error al actualizar la categoría",
                icon: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Cargando categoría...</p>;
    if (!categoria) return <p>No se pudo cargar la categoría.</p>;

    return (
        <div className="space-y-8 p-4">
            <div className="w-full max-w-md">
                {/* HEADER */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Editar categoría
                    </h2>
                    <p className="text-sm text-gray-500">
                        Modifica el nombre de la categoría
                    </p>
                </div>

                {/* INPUT */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* BOTONES */}
                <div className="flex justify-between items-center">
                    <Link
                        to="/admin/categories"
                        className="text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        ← Volver
                    </Link>

                    <button
                        onClick={handleGuardar}
                        disabled={saving}
                        className={`px-5 py-2 rounded-lg text-white transition ${saving
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>

            </div>
        </div>

    );
}
