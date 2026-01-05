import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";
import { useCart } from "../context/CarritoContext";
import { Link } from "react-router-dom";

export function CarritoResumen() {
    const { cart, increase, decrease, removeItem, clearCart } = useCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity * item.precio, 0);
    return (
        <>
            <Header />
            <main className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Resumen del Carrito
                </h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">
                            Tu carrito está vacío 😢
                        </p>

                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-3">

                        {/* LISTA DE ITEMS */}
                        <div className="md:col-span-2 space-y-4">
                            {cart.map(item => (
                                <div
                                    key={item.idItem}
                                    className="flex gap-4 bg-white rounded-xl shadow-sm p-4"
                                >
                                    {/* Imagen */}
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                                        alt={item.nombre}
                                        className="w-24 h-24 object-contain"
                                    />

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.nombre}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            S/ {item.precio} c/u
                                        </p>

                                        {/* Cantidad */}
                                        <div className="flex items-center gap-3 mt-3">
                                            <button
                                                onClick={() => decrease(item.idItem)}
                                                className="qty-btn"
                                            >
                                                −
                                            </button>

                                            <span className="min-w-[24px] text-center">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => increase(item.idItem)}
                                                className="qty-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal + eliminar */}
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            S/ {item.precio * item.quantity}
                                        </p>

                                        <button
                                            onClick={() => removeItem(item.idItem)}
                                            className="text-sm text-red-500 hover:underline mt-2"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RESUMEN */}
                        <div className="bg-gray-50 rounded-xl p-6 h-fit">
                            <h2 className="text-xl font-semibold mb-4">
                                Resumen
                            </h2>

                            <div className="flex justify-between mb-4">
                                <span>Total</span>
                                <span className="font-bold text-lg">
                                    S/ {totalItems}
                                </span>
                            </div>

                            <button
                                onClick={clearCart}
                                className="w-full text-blue-500 border-blue-500 border-2 rounded-lg py-2 mb-3  hover:bg-gray-100"
                            >
                                Vaciar carrito
                            </button>

                            <Link
                                to="/cart/check-out"
                                className="w-full block text-white norkys-bg-verde hover:opacity-90 font-semibold py-2 rounded-lg text-center transition"
                            >
                                Continuar compra
                            </Link>
                        </div>

                    </div>
                )}
                {/* VOLVER */}
                <div className="mt-10">
                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:text-norkys-verde transition"
                    >
                        ← Volver al listado
                    </Link>
                </div>

            </main>

            <Footer />
        </>
    );
}