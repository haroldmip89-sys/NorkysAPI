import { useState, useEffect } from "react";
import * as API from "../api/usuarios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function MyAccountUser() {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState(null)
    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: ''
    })
    //obtener el id usuario desde el session
    useEffect(() => {

        const data = sessionStorage.getItem("usuario");
        if (data) {
            const usuarioLogeado = JSON.parse(data);
            setUsuario(usuarioLogeado);
        }
    }, []);
    useEffect(() => {
        if (!usuario?.idUsuario) return;
        API.getUsuario(usuario.idUsuario).then(data =>
            setDatos({
                nombre: data.nombre ?? '',
                apellido: data.apellido ?? '',
                dni: data.dni ?? '',
                email: data.email ?? ''
            })
        )
    }, [usuario]);

    function handleSubmit(e) {
        e.preventDefault();
        API.updateUsuario(usuario.idUsuario, datos).then(data => {
            if (data) {
                // ACTUALIZAR sessionStorage
                const usuarioActualizado = {
                    ...usuario,
                    nombre: datos.nombre,
                    apellido: datos.apellido,
                    email: datos.email
                };
                sessionStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
                //toast.success("Se actualizo el usuario");
                Swal.fire({
                    title: "Éxito",
                    text: "Se actualizo el usuario",
                    icon: "success",
                });
                navigate("/");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Error al actualizar el usuario",
                    icon: "error",
                });
            }
        })
    };
    if (!usuario) {
        return <p>Cargando usuario...</p>;
    }

    return (
        <>
            {/* TÍTULO */}
            <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Datos personales
                </h2>
                <p className="text-sm text-gray-500">
                    Actualiza tu información de perfil
                </p>
            </div>
            <div >
                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                required
                                value={datos.nombre}
                                onChange={e => setDatos({ ...datos, nombre: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                required
                                value={datos.apellido}
                                onChange={e => setDatos({ ...datos, apellido: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                DNI
                            </label>
                            <input
                                type="text"
                                maxLength={8}
                                required
                                value={datos.dni}
                                onChange={e => setDatos({ ...datos, dni: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                required
                                value={datos.email}
                                onChange={e => setDatos({ ...datos, email: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                    </div>

                    {/* BOTÓN */}
                    <div className="pt-4  flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg norkys-bg-naranja text-white
                     font-medium text-sm hover:opacity-90 transition"
                        >
                            Guardar cambios
                        </button>
                    </div>

                </form>
            </div>
        </>
    )
}