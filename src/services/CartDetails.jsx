import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import * as API from '../api/carrito.js';

export function CartDetails() {
    let { id } = useParams();
    const [carrito, setCarrito] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // carrito.estado: para ver el estado, carrito.items.idItem: para ver los items)
        API.getCarritoCompleto(id).then(data => {
            //console.log(data);
            setCarrito(data);
        })
            .catch(error => {
                console.error("Error al obtener los detalles del carrito:", error);
            })
            .finally(() => setLoading(false)
            );
    }, [id]);
    // si loading es true, mostrar cargando
    if (loading) {
        return <p>Cargando carrito...</p>;
    }
    //si carrito es null, mostrar error
    if (!carrito) {
        return <p>No se pudo cargar el carrito.</p>;
    }
    return (
        <main className="max-w-5xl mx-auto px-4 py-10">
            {/* TÍTULO */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Detalle del Carrito #{id}
            </h1>

            <div className="grid gap-8 md:grid-cols-3">
                {/* LISTA DE ITEMS */}
                <div className="md:col-span-2 space-y-4">
                    {carrito.items.length === 0 ? (
                        <p className="text-gray-500">No hay productos en este carrito</p>
                    ) : (
                        carrito.items.map(item => (
                            <div
                                key={item.idItem}
                                className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-sm p-4"
                            >
                                {/* Imagen */}
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                                    alt={item.nombreItem}
                                    className="w-full sm:w-24 h-40 sm:h-24 object-contain mx-auto sm:mx-0"
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">
                                        {item.nombreItem}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        S/ {item.precioUnitario} c/u
                                    </p>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Cantidad: <span className="font-medium">{item.cantidad}</span>
                                    </p>
                                </div>

                                {/* Subtotal */}
                                <div className="text-right">
                                    <p className="font-semibold">
                                        S/ {item.subtotal}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RESUMEN */}
                <div className="bg-gray-50 rounded-xl p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-4">
                        Resumen
                    </h2>

                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Estado</span>
                            <span className="font-medium">{carrito.estado}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Método de pago</span>
                            <span className="font-medium">
                                {carrito.metodoPago ?? "No definido"}
                            </span>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>S/ {carrito.total}</span>
                    </div>
                </div>
            </div>

            {/* VOLVER */}

        </main>
    );
}