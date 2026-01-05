import { Link } from "react-router-dom";
import { useCart } from "../context/CarritoContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import logo from "../assets/Norkys-icon.png";

export function Header() {
    const { totalItems } = useCart(); // Placeholder for total items in cart
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    // Cargar usuario desde sessionStorage al montar el componente
    useEffect(() => {
        const data = sessionStorage.getItem("usuario");
        if (data) {
            setUsuario(JSON.parse(data));
        }
    }, []);

    function irMiCuenta() {
        if (!usuario) {
            navigate("/login");
        }
        if (usuario.esAdmin) {
            navigate("/admin/dashboard");
        }
        else {
            navigate("/my-account/edit");
        }
    }
    return (
        <>
            <header className="bg-white border-t-7 norkys-border-naranja shadow-sm sticky top-0 z-50 bg-white ">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-3 justify-center sm:justify-start">
                        <img src={logo} alt="Norkys Logo" className="h-9 sm:h-10" />
                        <span className="text-lg font-bold norkys-verde">Norkys</span>
                    </Link>

                    {/* ACCIONES */}
                    <div className="flex items-center justify-center sm:justify-end gap-4 text-sm font-medium">
                        {/* CARRITO */}
                        {(!usuario || !usuario.esAdmin) && (
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-1 text-gray-700 hover:norkys-naranja transition"
                        >
                            <span className="hidden sm:inline">Mi carrito</span>
                            <FiShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-3 -right-3 norkys-bg-verde text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                        {/* USUARIO */}
                        {usuario ? (
                            <button
                                onClick={irMiCuenta}
                                className="flex items-center gap-2 text-gray-700 hover:norkys-verde transition"
                            >
                                <span>{usuario.nombre}</span><FiUser size={20} />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-gray-700 hover:norkys-naranja transition"
                            >
                                <span>Iniciar sesión</span><FiUser size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}