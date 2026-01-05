import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { useCart } from "../context/CarritoContext";
import {
    FiUser,
    FiMapPin,
    FiShoppingCart,
    FiHeart,
    FiLogOut
} from "react-icons/fi";

export function MyAccountLayout() {

    const [usuario, setUsuario] = useState(null);
    const { clearCartSilent } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const data = sessionStorage.getItem("usuario");
        if (!data) {
            navigate("/login");
            return;
        }
        const usuarioParsed = JSON.parse(data);
        setUsuario(usuarioParsed);

        if (usuarioParsed.esAdmin) {
            navigate("/no-permission");
        }
    }, []);
    // Función para cerrar sesión
    function handleLogout() {
        sessionStorage.removeItem("usuario");
        clearCartSilent();
        setUsuario(null);
        navigate("/");
    }
    if (!usuario) return <p>Cargando...</p>;

    return (
        <>
            <Header />

            <div className=" min-h-screen py-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">

                    {/* MENÚ LATERAL */}
                    <nav className="bg-white rounded-xl shadow-sm p-6 h-fit">
                        <h3 className="font-semibold text-lg text-gray-800 mb-4">
                            Mi cuenta
                        </h3>

                        <ul className="space-y-2 text-sm">
                            <li>
                                <NavLink
                                    to="/my-account/edit"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md transition
                                    ${isActive
                                            ? "norkys-bg-verde text-white"
                                            : "text-gray-700 hover:bg-gray-100"}`
                                    }
                                >
                                    <FiUser size={18} />
                                    <span>Datos personales</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/my-account/address"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md transition
                                    ${isActive
                                            ? "norkys-bg-verde text-white"
                                            : "text-gray-700 hover:bg-gray-100"}`
                                    }
                                >
                                    <FiMapPin size={18} />
                                    <span>Mis direcciones</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/my-account/carts"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md transition
                                    ${isActive
                                            ? "norkys-bg-verde text-white"
                                            : "text-gray-700 hover:bg-gray-100"}`
                                    }
                                >
                                    <FiShoppingCart size={18} />
                                    <span>Mis carritos</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/my-account/wishlist"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md transition
                                    ${isActive
                                            ? "norkys-bg-verde text-white"
                                            : "text-gray-700 hover:bg-gray-100"}`
                                    }
                                >
                                    <FiHeart size={18} />
                                    <span>Mis favoritos</span>
                                </NavLink>
                            </li>

                            <li className="pt-3  mt-4 border-t">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
                                >
                                    <FiLogOut size={18} />
                                    <span>Cerrar sesión</span>
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* CONTENIDO DERECHA */}
                    <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm">
                        <Outlet />
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}
