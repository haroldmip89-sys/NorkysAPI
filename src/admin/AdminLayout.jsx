import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Footer } from "../layout/Footer";
import { Header } from "../layout/Header";
import {
  FiGrid,
  FiShoppingCart,
  FiBox,
  FiTag,
  FiLogOut
} from "react-icons/fi";

export function AdminLayout() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    useEffect(() => {
        const data = sessionStorage.getItem("usuario");
        //si es data es null, undefined o '' llevar al login
        if (!data) {
            navigate("/login");
            return;
        }
        const usuarioParsed = JSON.parse(data);
        setUsuario(usuarioParsed);

        if (!usuarioParsed.esAdmin) {
            navigate("/no-permission");
        }
    }, []);
    // Función para cerrar sesión
    function handleLogout() {
        sessionStorage.removeItem("usuario");
        //clearCartSilent();
        setUsuario(null);
        navigate("/");
    }
    if (!usuario) return <p>Cargando...</p>;

    return (
        <>
            <Header />

      <div className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">

          {/* SIDEBAR */}
          <nav className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Panel Admin
            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition
                    ${isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  <FiGrid size={18} />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/carts"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition
                    ${isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  <FiShoppingCart size={18} />
                  <span>Carritos</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/items"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition
                    ${isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  <FiBox size={18} />
                  <span>Items</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/categories"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition
                    ${isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  <FiTag size={18} />
                  <span>Categorías</span>
                </NavLink>
              </li>

              <li className="pt-3 mt-4 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2
                             rounded-md text-red-600 hover:bg-red-50 transition"
                >
                  <FiLogOut size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </li>

            </ul>
          </nav>

          {/* CONTENIDO */}
          <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm">
            <Outlet />
          </div>

        </div>
      </div>

      <Footer />
        </>
    )
}