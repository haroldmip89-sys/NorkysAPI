import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

export function ItemCard({
    item,
    categoria,
    isFavorite,
    onToggleWishlist,
    usuario
}) {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative">

            {/* BOTÓN FAVORITO */}
            {usuario && !usuario.esAdmin &&(
                <button
                    onClick={() => onToggleWishlist(item.idItem)}
                    className={`absolute top-3 right-3 text-xl transition
                        ${isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-400"}
                    `}
                >
                    <FiHeart fill={isFavorite ? "currentColor" : "none"} />
                </button>
            )}

            {/* IMAGEN */}
            <img
                src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                alt={item.nombre}
                className="w-full h-48 object-cover"
            />

            {/* CONTENIDO */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-800 truncate">
                    {item.nombre}
                </h3>

                <p className="text-sm text-gray-500">
                    {categoria}
                </p>

                <p className="font-bold text-lg norkys-naranja">
                    S/ {item.precio}
                </p>

                <Link
                    to={`/item/${item.idItem}`}
                    className="block text-center mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                >
                    Comprar
                </Link>
            </div>
        </div>
    );
}
