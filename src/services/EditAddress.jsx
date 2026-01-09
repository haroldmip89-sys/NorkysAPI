import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Maps } from "../components/Maps.jsx";
import { toast } from "react-toastify";
import { useCallback } from "react";
import * as API from "../api/direcciones.js";

export function EditAddress() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [mapBloqueado, setMapBloqueado] = useState(true); // ✅ por defecto bloqueado
    const [initialPosition, setInitialPosition] = useState(null);
    const handleSelectPosition = useCallback(({ lat, lng }) => {
        setDireccion(prev => ({
            ...prev,
            latY: lat,
            longX: lng
        }));
        setInitialPosition({
            lat,
            lng
        });
    }, []);
    const [direccion, setDireccion] = useState({
        tituloDireccion: "",
        direccion: "",
        referencia: "",
        telefono1: "",
        telefono2: "",
        latY: "",
        longX: "",
        idUsuario: null
    });
    //obtener el id del usuario logeado
    useEffect(() => {
        const data = sessionStorage.getItem("usuario");
        if (data) {
            const usuarioLogeado = JSON.parse(data);
            setUsuario(usuarioLogeado);
            setDireccion(prev => ({
                ...prev,
                idUsuario: usuarioLogeado.idUsuario
            }));
        }
    }, []);
    //obtener los datos de la direccion por id
    useEffect(() => {
        API.getById(id).then(data => {
            // debe llenar el formulario con los datos obtenidos
            setDireccion({
                tituloDireccion: data.tituloDireccion,
                idUsuario: data.idUsuario,
                direccion: data.direccion,
                referencia: data.referencia,
                telefono1: data.telefono1,
                telefono2: data.telefono2,
                latY: data.latY,
                longX: data.longX
            });

            // Convertir a number para el mapa
            setInitialPosition({
                lat: Number(data.latY),
                lng: Number(data.longX)
            });
        });
    }, [id]);
    function handleSubmit(event) {
        event.preventDefault();
        //imprimir en consola los datos del formulario
        console.log(direccion);
        API.update(id, direccion).then(data => {
            if (data) {
                //alert("Dirección actualizada con éxito");
                document.getElementById('formulario').reset();
                Swal.fire({
                    title: "Éxito",
                    text: "Dirección actualizada con éxito",
                    icon: "success",
                });
                navigate("/my-account/address");
            } else {
                //alert("Error al actualizar la dirección");
                Swal.fire({
                    title: "Error",
                    text: "Error al actualizar la dirección",
                    icon: "error",
                });
            }
        });
    }
    if (!initialPosition) return <p>Cargando mapa...</p>;
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Editar dirección
                </h2>
                <p className="text-sm text-gray-500">
                    Actualiza la información y ubicación
                </p>
            </div>
            <div className="max-w-3xl mx-auto px-4">
                
                {/* MAPA */}
                <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
                    <Maps
                        initialPosition={initialPosition}
                        onSelectPosition={handleSelectPosition}
                        readOnly={mapBloqueado} 
                    />
                </div>
                {/* Checkbox para bloquear mapa */}
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="lockMap"
                                    className="mr-2"
                                    checked={mapBloqueado}
                                    onChange={(e) => setMapBloqueado(e.target.checked)}
                                />
                                <label htmlFor="lockMap" className="text-sm text-gray-700">
                                    Bloquear selección del mapa
                                </label>
                            </div>
                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl" id="formulario">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Input
                            label="Título de la dirección"
                            value={direccion.tituloDireccion}
                            onChange={e =>
                                setDireccion({ ...direccion, tituloDireccion: e.target.value })
                            }
                        />

                        <Input
                            label="Dirección"
                            value={direccion.direccion}
                            onChange={e =>
                                setDireccion({ ...direccion, direccion: e.target.value })
                            }
                        />

                        <Input
                            label="Referencia"
                            value={direccion.referencia}
                            onChange={e =>
                                setDireccion({ ...direccion, referencia: e.target.value })
                            }
                        />

                        <Input
                            label="Teléfono 1"
                            value={direccion.telefono1}
                            onChange={e =>
                                setDireccion({ ...direccion, telefono1: e.target.value })
                            }
                        />

                        <Input
                            label="Teléfono 2 (opcional)"
                            value={direccion.telefono2}
                            onChange={e =>
                                setDireccion({ ...direccion, telefono2: e.target.value })
                            }
                        />

                    </div>

                    <div className="text-sm text-gray-500">
                        <p>Latitud: {direccion.latY}</p>
                        <p>Longitud: {direccion.longX}</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg norkys-bg-naranja
                       text-white font-medium hover:opacity-90 transition"
                        >
                            Guardar cambios
                        </button>
                    </div>

                </form></div>
        </div>
    );
}
function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                {...props}
                required
                className="w-full border border-gray-300 rounded-lg
                   px-4 py-2 text-sm focus:ring-2 focus:ring-gray-800"
            />
        </div>
    );
}
