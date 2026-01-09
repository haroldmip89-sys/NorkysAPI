import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as API from '../api/usuarios.js';
import imagen from '../assets/Norkys-icon.png';

export function Login() {
    //Estado para almacenar los datos del usuario
    const [user, setUser] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    //Función para el manejo del envío del formulario
    async function handleSubmit(e) {
        e.preventDefault();
        const response = await API.login(user.email, user.password);
        if (!response.ok) {
            Swal.fire({
                    title: "Error",
                    text: response.error,
                    icon: "error",
                });
            //alert(response.error);  "Credenciales incorrectas"
            return;
        }
        //guardamos el json en usuario y creamos el sessionStorage
        const usuario = response.data;
        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        const esAdmin = await API.isAdmin(usuario.idUsuario);
        sessionStorage.setItem("esAdmin", esAdmin);
        console.log(usuario);
        if (esAdmin) {
            navigate("/admin");
            Swal.fire({
                title: "Bienvenido Admin!",
                text: "Ha ingresado correctamente!",
                icon: "success"
            });
        } else {
            navigate("/");
            Swal.fire({
                title: "Bienvenido a Norkys!",
                text: "Ha ingresado correctamente!",
                icon: "success"
            });
        }
    }
    //Renderizado del componente de login
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img src={imagen} alt="imagen" className="w-24 sm:w-32" />
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Iniciar sesión
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="correo@ejemplo.com"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="••••••••"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            required
                        />
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        Ingresar
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    <Link to="/" className="text-blue-600 hover:underline">
                        Volver al listado
                    </Link>
                </p>
            </div>
        </div>
        </>
    )
}