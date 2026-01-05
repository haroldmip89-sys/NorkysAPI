import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import * as API from '../api/items.js';
import { useParams } from "react-router-dom";
import { useCart } from "../context/CarritoContext.jsx";
import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";
export function ItemDetail() {
    // Obtener el id del parámetro de la URL
    const { id } = useParams();
    const { addToCart } = useCart();

    const [item, setItem] = useState([]); // Aquí iría la lógica para obtener el detalle del ítem por su ID
    const [qty, setQty] = useState(1);
    useEffect(() => {
        API.getItemById(id).then((data) => {
            if (data) setItem(data);
        });
    }, [id]);
    if (!item) return <p>Cargando...</p>;
    return (
        <>
            <Header></Header>
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* CONTENEDOR PRINCIPAL */}
                <div className="grid gap-10 md:grid-cols-2 items-start">

                    {/* IMAGEN */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center">
                        <img
                            src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                            alt={item.nombre}
                            className="max-h-[380px] object-contain"
                        />
                    </div>

                    {/* INFO */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {item.nombre}
                        </h1>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {item.descripcion}
                        </p>

                        <p className="text-2xl font-semibold norkys-verde mb-6">
                            S/. {item.precio}
                        </p>

                        {/* CANTIDAD */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-medium text-gray-700">
                                Cantidad:
                            </span>

                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                >
                                    −
                                </button>

                                <span className="px-4 py-2 min-w-[40px] text-center">
                                    {qty}
                                </span>

                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="px-4 py-2 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => addToCart(item, qty)}
                            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition"
                        >
                            Añadir al carrito
                        </button>

                        {/* VOLVER */}
                        <div className="mt-6">
                            <Link to="/" className="text-sm link-norkys">
                                ← Volver al listado
                            </Link>
                        </div>
                    </div>

                </div>

            </main>
            <Footer></Footer>
        </>
    );
}