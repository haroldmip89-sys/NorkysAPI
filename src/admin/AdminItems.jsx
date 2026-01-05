import { useState, useEffect } from "react";
import * as API from "../api/items.js";
import * as API_Cat from '../api/categorias.js';
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
export function AdminItems() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [mapCat, setMapCat] = useState({}); // id -> nombre
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            const data = await API.getItems();
            setLista(data || []);
            setLoading(false);
        };
        cargar();
    }, []);

    //cargar categorias
    useEffect(() => {
        API_Cat.getCategorias().then((cats) => {
            setCategorias(cats);
            const m = {};
            cats.forEach(c => { m[c.idCategoria] = c.nombre; });
            setMapCat(m);
            setLoading(false);
        });
    }, []);
    //cargar items
    useEffect(() => {
        if (categoriaSeleccionada === "Todos") {
            API.getItems().then(setLista);
        } else {
            API.getItemsByCategoria(categoriaSeleccionada).then(setLista);
        }
    }, [categoriaSeleccionada]);
    //pendiente funcion delete
    async function handleDelete(id) {
        const confirm = window.confirm("¿Seguro que deseas eliminar este item?");
        if (!confirm) return;

        const ok = await API.deleteItem(id);

        if (ok) {
            Swal.fire({
                title: "Éxito",
                text: "Item eliminado correctamente",
                icon: "success",
            });
            setLista(prev => prev.filter(item => item.idItem !== id));
        } else {
            Swal.fire({
                title: "Error",
                text: "Error al eliminar el item",
                icon: "error",
            });
        }
    }

    return (
        <>
            <div className="p-4 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Administrar Items
                        </h2>
                        <p className="text-sm text-gray-500">
                            Gestión de Items del sistema
                        </p>
                    </div>
                </div>

                {/* Filtro */}
                <div className="mb-4 flex items-center gap-3 flex-wrap justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600">
                            Categoría
                        </label>
                        <select
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Todos">Todos</option>
                            {categorias.map((cat) => (
                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Link
                        to="/admin/new-item"
                        className="norkys-bg-verde hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        + Agregar Item
                    </Link>
                </div>

                {/* Estados */}
                {loading && (
                    <p className="text-gray-500 text-sm">Cargando items...</p>
                )}

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                {/* Tabla */}
                {!loading && lista.length > 0 && (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm overflow-hidden">
                            <thead className="bg-gray-100 text-sm text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Nombre</th>
                                    <th className="px-4 py-2 text-left">Precio</th>
                                    <th className="px-4 py-2 text-left">Imagen</th>
                                    <th className="px-4 py-2 text-left">Categoría</th>
                                    <th className="px-4 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {lista.map((item) => (
                                    <tr
                                        key={item.idItem}
                                        className=" hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2">{item.idItem}</td>
                                        <td className="px-4 py-2 font-medium">{item.nombre}</td>
                                        <td className="px-4 py-2">S/ {item.precio}</td>
                                        <td className="px-4 py-2">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                                                className="h-20 object-cover rounded-md"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            {mapCat[item.idCategoria] || item.idCategoria}
                                        </td>
                                        <td className="px-4 py-2 text-center space-y-2">
                                            <div className="flex justify-center gap-4">
                                                <Link
                                                    to={`/admin/items/${item.idItem}`}
                                                    className="text-gray-600 hover:text-blue-600 transition"
                                                >
                                                    <FiEdit size={18} />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(item.idItem)}
                                                    className="text-gray-600 hover:text-red-600 transition"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && lista.length === 0 && !error && (
                    <p className="text-gray-500 text-sm mt-4">
                        No hay resultados para esta categoría.
                    </p>
                )}

            </div>
        </>
    )
}