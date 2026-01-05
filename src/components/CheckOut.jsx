import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";
import { useCart } from "../context/CarritoContext";
import { useCallback } from "react";
import * as API from '../api/carrito.js';
import * as DIRECC from "../api/direcciones.js";
import { Maps } from "./Maps.jsx";
//creacion del payload y navegacion al componente CartConfirmed
export function CheckOut() {
    const { cart, clearCartSilent } = useCart();
    const [mapBloqueado, setMapBloqueado] = useState(true); // ✅ por defecto bloqueado
    const navigate = useNavigate();
    const [coords, setCoords] = useState({ lat: null, lng: null });
    const handleSelectPosition = useCallback(({ lat, lng }) => {
        setDireccionData(prev => ({
            ...prev,
            latY: lat,
            longX: lng
        }));
        //console.log("Lat:", lat, "Lng:", lng);
    }, []);
    // Datos del usuario logueado o null
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const idUsuario = usuario?.idUsuario || null;

    const [direcciones, setDirecciones] = useState([]);
    const [idDireccionSeleccionada, setIdDireccionSeleccionada] = useState(null);

    // Datos de la direccion a enviar
    const [direccionData, setDireccionData] = useState({
        tituloDireccion: null,
        direccion: null,
        referencia: null,
        telefono1: null,
        telefono2: null,
        latY: null,
        longX: null
    });

    // Datos del cliente invitado
    const [invitado, setInvitado] = useState({
        nombreCliente: null,
        apellidoCliente: null,
        emailCliente: null,
        dniCliente: null
    });

    // Respuesta de la API
    const [mensaje, setMensaje] = useState("");
    // Calcular total del carrito
    const totalItems = cart.reduce((sum, item) => sum + item.quantity * item.precio, 0).toFixed(2);

    // Cargar direcciones del usuario si hay idUsuario
    useEffect(() => {
        if (idUsuario) {
            DIRECC.getAllById(idUsuario).then((dirs) => {
                setDirecciones(dirs);
                if (dirs.length > 0) {
                    setIdDireccionSeleccionada(dirs[0].idDireccion);  // Seleccionar la primera
                }
            });
        }
    }, [idUsuario]);
    // Cargar datos de la dirección seleccionada
    useEffect(() => {
        if (!idUsuario) return;   // <- EVITA QUE INVITADO HAGA REQUESTS
        if (!idDireccionSeleccionada) return;

        DIRECC.getById(idDireccionSeleccionada).then(data => {
            setDireccionData({
                tituloDireccion: data.tituloDireccion,
                direccion: data.direccion,
                referencia: data.referencia,
                telefono1: data.telefono1,
                telefono2: data.telefono2,
                latY: data.latY,
                longX: data.longX
            });
        });
    }, [idUsuario, idDireccionSeleccionada]);

    const handleConfirmarCompra = async (e) => {
        e.preventDefault();
        // Validar dirección según tipo de usuario
        if (idUsuario) {
            // Usuario logeado → debe elegir dirección del select
            if (idUsuario && !idDireccionSeleccionada) {
                setMensaje("Debe seleccionar una dirección.");
                return;
            }
        } else {
            // Invitado → debe llenar los campos manualmente
            if (!direccionData.tituloDireccion ||
                !direccionData.direccion ||
                !direccionData.telefono1 ||
                !direccionData.latY ||
                !direccionData.longX
            ) {
                setMensaje("Debe completar la dirección para continuar.");
                return;
            }
        }
        // 2. Obtener datos de la dirección según el tipo de usuario
        let direccion = null;

        if (idUsuario) {
            // Usuario logueado → sí debe traer dirección de BD
            direccion = await DIRECC.getById(idDireccionSeleccionada);
        } else {
            // Invitado → usa los datos escritos en el formulario
            direccion = direccionData;
        }

        // Transformar el carrito al formato del SP
        const detalles = cart.map(item => ({
            IdItem: item.idItem,
            Cantidad: item.quantity
        }));
        // 3. Payload EXACTO que el backend requiere para crear el carrito
        const payload = {
            idUsuario: idUsuario,

            // Datos de invitado o null si es logueado
            nombreCliente: idUsuario ? usuario.nombre : invitado.nombreCliente,
            apellidoCliente: idUsuario ? usuario.apellido : invitado.apellidoCliente,
            emailCliente: idUsuario ? usuario.email : invitado.emailCliente,
            dniCliente: idUsuario ? usuario.dni : invitado.dniCliente,
            idDireccion: idUsuario ? Number(idDireccionSeleccionada) : null,
            // Datos reales de la dirección
            tituloDireccion: direccion.tituloDireccion ?? null,
            direccion: direccion.direccion ?? null,
            referencia: direccion.referencia || null,
            telefono1: direccion.telefono1 || null,
            telefono2: direccion.telefono2 || null,

            latY: direccion.latY === "" || direccion.latY === null ? null : Number(direccion.latY),
            longX: direccion.longX === "" || direccion.longX === null ? null : Number(direccion.longX),

            detalles: detalles
        };
        console.log("Payload enviado:", payload);
        try {
            sessionStorage.setItem("payloadCarrito", JSON.stringify(payload));
            // const data = await API.crearCarrito(payload);
            // setMensaje("Carrito creado con éxito. ID: " + data.IdCarrito);
            // Vaciar carrito sin toastear
            //clearCartSilent();
            navigate("/cart/cart-confirmed");
        } catch (error) {
            console.error(error);
            setMensaje("Error al crear el carrito");
        }
    };
    if (cart.length === 0) {
        return (
            <>
                <Header></Header>
                <h2>Ocurrió un error</h2>
                <p>No hay productos en el carrito para confirmar.</p>
                <p><Link to={"/"}>Volver al listado</Link></p>
                <Footer></Footer>
            </>
        );
    }
    return (
        <>
            <Header></Header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">
                    Confirmar Pedido
                </h1>
                <div className="grid gap-10 lg:grid-cols-2">
                    {/* COLUMNA IZQUIERDA */}
                    <section className="space-y-8">
                        {idUsuario ? 
                        (
                            <>
                                <h3 className="text-lg font-semibold mb-2">Dirección de entrega</h3>
                                <select
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-norkys-verde"
                                    value={idDireccionSeleccionada ?? ""}
                                    onChange={(e) => setIdDireccionSeleccionada(e.target.value)}
                                >
                                    {direcciones.map(d => (
                                        <option key={d.idDireccion} value={d.idDireccion}>{d.tituloDireccion}</option>
                                    ))}
                                </select>
                            </>) : 
                            (<>
                                <h3 className="text-lg font-semibold mb-2">Datos del cliente invitado</h3>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={invitado.nombreCliente}
                                        onChange={e => setInvitado({ ...invitado, nombreCliente: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-norkys-verde"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Apellido"
                                        value={invitado.apellidoCliente}
                                        onChange={e => setInvitado({ ...invitado, apellidoCliente: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-norkys-verde"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo"
                                        value={invitado.emailCliente}
                                        onChange={e => setInvitado({ ...invitado, emailCliente: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-norkys-verde"
                                    />
                                    <input
                                        type="text"
                                        placeholder="DNI"
                                        value={invitado.dniCliente}
                                        onChange={e => setInvitado({ ...invitado, dniCliente: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-norkys-verde"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título de dirección"
                                        value={direccionData.tituloDireccion}
                                        onChange={e => setDireccionData({ ...direccionData, tituloDireccion: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-norkys-verde"
                                    />
                                </div>
                            </>
                        )}
                        {/* Campos de dirección (siempre visibles) */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                Ubicación en el mapa
                            </h3>
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
                            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Detalles de dirección
                                </h3>

                                {/* Campos de dirección */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        value={direccionData.direccion || ""}
                                        onChange={(e) =>
                                            setDireccionData({ ...direccionData, direccion: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Referencia
                                    </label>
                                    <input
                                        type="text"
                                        value={direccionData.referencia || ""}
                                        onChange={(e) =>
                                            setDireccionData({ ...direccionData, referencia: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono 1
                                        </label>
                                        <input
                                            type="text"
                                            value={direccionData.telefono1 || ""}
                                            onChange={(e) =>
                                                setDireccionData({ ...direccionData, telefono1: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono 2
                                        </label>
                                        <input
                                            type="text"
                                            value={direccionData.telefono2 || ""}
                                            placeholder="Opcional"
                                            onChange={(e) =>
                                                setDireccionData({ ...direccionData, telefono2: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="relative rounded-xl overflow-hidden border h-[300px]">
                                    <Maps
                                        onSelectPosition={handleSelectPosition}
                                        initialPosition={{
                                            lat: direccionData.latY,
                                            lng: direccionData.longX
                                        }}
                                        readOnly={mapBloqueado} // <-- bloquear o permitir selección
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Lat: {direccionData.latY ?? "—"} | Lng: {direccionData.longX ?? "—"}
                            </p>
                        </div>

                        {mensaje && <p className="text-red-500 mt-2">{mensaje}</p>}
                        <button
                            onClick={handleConfirmarCompra}
                            className="w-full bg-orange-500 hover:opacity-90 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Confirmar Compra
                        </button>
                    </section>

                    {/* COLUMNA DERECHA */}
                    <section className="space-y-6">
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Resumen del carrito
                            </h2>

                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div
                                        key={item.idItem}
                                        className="flex gap-4 pb-4 last:border-none"
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                                            alt={item.nombre}
                                            className="w-20 h-20 object-contain bg-gray-50 rounded"
                                        />

                                        <div className="flex-1">
                                            <p className="font-medium">{item.nombre}</p>
                                            <p className="text-sm text-gray-500">
                                                S/ {item.precio} x {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold">
                                            S/ {(item.precio * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-6 text-lg font-bold">
                                <span>Total</span>
                                <span className="text-norkys-naranja">
                                    S/ {totalItems}
                                </span>
                            </div>
                        </section>
                    </section>
                </div>

                <div className="mt-10">
                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:text-norkys-verde transition"
                    >
                        ← Volver al listado
                    </Link>
                </div>
            </main>

            <Footer></Footer>
        </>
    );
}