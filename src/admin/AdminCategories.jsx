import { useState, useEffect } from "react"
import * as API from '../api/categorias.js';
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

export function AdminCategories() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        API.getCategorias().then((data) => {
            setLista(data);
            setLoading(false);
            //console.log(data);
        });
    }, []);
    if (loading) {
        return <><p>Cargando...</p></>
    }
    return (
        <>
            <div className="p-4 space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Administrar Categorías
                        </h2>
                        <p className="text-sm text-gray-500">
                            Gestión de categorías del sistema
                        </p>
                    </div>
                </div>

                {/* TABLA */}
                {lista.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg max-w-3xl mx-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                    <th className="px-4 py-3 text-center font-semibold">Acción</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {lista.map(cat => (
                                    <tr
                                        key={cat.idCategoria}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            #{cat.idCategoria}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {cat.nombre}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center">
                                                <Link
                                                    to={`/admin/categories/${cat.idCategoria}`}
                                                    className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
                                                    title="Editar categoría"
                                                >
                                                    <FiEdit size={16} />
                                                    <span className="text-xs">Editar</span>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No hay categorías registradas.
                    </p>
                )}
            </div>
        </>
    )
}