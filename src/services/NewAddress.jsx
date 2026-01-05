import { Maps } from "../components/Maps.jsx";
import { useEffect, useState } from "react";
import * as API from "../api/direcciones.js";
import { useNavigate } from "react-router-dom";

export function NewAddress() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
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
            <h2>Nueva Direccion</h2>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <div style={{
                    width: "100%",
                    height: "300px",
                    borderRadius: "10px",
                    overflow: "hidden",
                }}
                >
                    <Maps initialPosition={initialPosition} onSelectPosition={handleSelectPosition} />
                </div>
            </div><br />
            {/* Aquí va el formulario para crear la dirección */}
            <form action="" id="formulario" onSubmit={handleSubmit}>
                Titulo de Direccion: <input type="text" name="tituloDireccion" required value={newDireccion.tituloDireccion} onChange={event => setNewDireccion({ ...newDireccion, tituloDireccion: event.target.value })} /><br />
                Direccion: <input type="text" name="direccion" required value={newDireccion.direccion} onChange={event => setNewDireccion({ ...newDireccion, direccion: event.target.value })} /><br />
                Referencia: <input type="text" name="referencia" value={newDireccion.referencia} onChange={event => setNewDireccion({ ...newDireccion, referencia: event.target.value })} /><br />
                Telefono 1: <input type="text" name="telefono1" required value={newDireccion.telefono1} onChange={event => setNewDireccion({ ...newDireccion, telefono1: event.target.value })} /><br />
                Telefono 2: <input type="text" placeholder="opcional" name="telefono2" value={newDireccion.telefono2} onChange={event => setNewDireccion({ ...newDireccion, telefono2: event.target.value })} /><br />
                <input type="text" name="latY" value={newDireccion.latY} readOnly hidden />{/* <br /> */}
                <input type="text" name="longX" value={newDireccion.longX} readOnly hidden />{/* <br /> */}
                <p>Latitud: {newDireccion.latY}</p>
                <p>Longitud: {newDireccion.longX}</p>
                <button type="submit">Guardar Cambios</button>
            </form>
        </>
    )
}