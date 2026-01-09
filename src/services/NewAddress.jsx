import { Maps } from "../components/Maps.jsx";
import { useEffect, useState } from "react";
import * as API from "../api/direcciones.js";
import { useNavigate } from "react-router-dom";

export function NewAddress() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [mapBloqueado, setMapBloqueado] = useState(true); 
    const [initialPosition, setInitialPosition] = useState(null);
    const [newDireccion, setNewDireccion] = useState({
        idUsuario: 0,
        tituloDireccion: '',
        direccion: '',
        referencia: '',
        telefono1: '',
        telefono2: '',
        latY: '',
        longX: ''
    }
    );
    function handleSelectPosition({ lat, lng }) {
        setNewDireccion(prev => ({
            ...prev,
            latY: lat,
            longX: lng
        }));

        // 🔥 disparador de animación
        setInitialPosition({
            lat,
            lng
        });
    }
    //obtener el id usuario desde el session
    useEffect(() => {
        const data = sessionStorage.getItem("usuario");
        if (data) {
            const usuarioLogeado = JSON.parse(data);
            setUsuario(usuarioLogeado);
            setNewDireccion(prev => ({
                ...prev,
                idUsuario: usuarioLogeado.idUsuario
            }))
            setInitialPosition({ lat: -12.0464, lng: -77.0428 });
        }
    }, []);
    //funcion para evitar campos ''
    // function normalizeDireccion(d) {
    //     return {
    //         ...d,
    //         tituloDireccion: d.tituloDireccion?.trim() || null,
    //         direccion: d.direccion?.trim() || null,
    //         referencia: d.referencia?.trim() || null,
    //         telefono1: d.telefono1?.trim() || null,
    //         telefono2: d.telefono2?.trim() || null,
    //         latY: Number(d.latY),
    //         longX: Number(d.longX)
    //     };
    // }

    function handleSubmit(e) {
        e.preventDefault();
        if (!newDireccion.latY || !newDireccion.longX) {
            alert("Seleccione una ubicación en el mapa");
            return;
        }
        
        console.log(newDireccion);
        //alert('Direccion agregada');
        setNewDireccion({
            tituloDireccion: '',
            direccion: '',
            referencia: '',
            telefono1: '',
            telefono2: '',
            latY: '',
            longX: ''
        })
        //navigate("/my-account/address");
        API.create(newDireccion).then(data => {
            if (data) {
                Swal.fire({
                    title: "Éxito",
                    text: "La dirección ha sido agregada correctamente",
                    icon: "success",
                });
                navigate("/my-account/address");
            }
            else {
                Swal.fire({
                    title: "Error",
                    text: "Ocurrio un error al agregar la dirección",
                    icon: "Error",
                });
            }
        })
    }
    if (!initialPosition) return <p>Cargando mapa...</p>;
    return (
        <>
             <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Nueva dirección
                </h2>
                <p className="text-sm text-gray-500">
                    Registra una nueva dirección de entrega
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

                {/* Checkbox bloquear mapa */}
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
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-w-3xl"
                    id="formulario"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Input
                            label="Título de la dirección"
                            value={newDireccion.tituloDireccion}
                            onChange={e =>
                                setNewDireccion({ ...newDireccion, tituloDireccion: e.target.value })
                            }
                        />

                        <Input
                            label="Dirección"
                            value={newDireccion.direccion}
                            onChange={e =>
                                setNewDireccion({ ...newDireccion, direccion: e.target.value })
                            }
                        />

                        <Input
                            label="Referencia"
                            value={newDireccion.referencia}
                            onChange={e =>
                                setNewDireccion({ ...newDireccion, referencia: e.target.value })
                            }
                        />

                        <Input
                            label="Teléfono 1"
                            value={newDireccion.telefono1}
                            onChange={e =>
                                setNewDireccion({ ...newDireccion, telefono1: e.target.value })
                            }
                        />

                        <Input
                            label="Teléfono 2 (opcional)"
                            value={newDireccion.telefono2}
                            onChange={e =>
                                setNewDireccion({ ...newDireccion, telefono2: e.target.value })
                            }
                        />

                    </div>

                    <div className="text-sm text-gray-500">
                        <p>Latitud: {newDireccion.latY}</p>
                        <p>Longitud: {newDireccion.longX}</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg norkys-bg-naranja
                            text-white font-medium hover:opacity-90 transition"
                        >
                            Guardar dirección
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
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