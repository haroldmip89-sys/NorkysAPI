import { useEffect, useRef } from "react";
import L from "leaflet";

export function Maps({ onSelectPosition, initialPosition, readOnly = false  }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapContainerRef = useRef(null);
    // Guardar referencia al handler para poder eliminarlo si cambia readOnly
    const clickHandlerRef = useRef(null);

    useEffect(() => {
        // Si el mapa ya fue inicializado → NO volver a crearlo
        if (mapRef.current) return;

        const defaultLat = initialPosition?.lat ?? -12.0464;
        const defaultLng = initialPosition?.lng ?? -77.0428;

        // Crear mapa SOLO UNA VEZ
        mapRef.current = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(mapRef.current);

        const markerIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconAnchor: [12, 41],
        });

        // Evento click
        mapRef.current.on("click", (e) => {
            if (readOnly) return; // 🚫 NO mover marcador
            const { lat, lng } = e.latlng;

            if (!markerRef.current) {
                markerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(mapRef.current);
            } else {
                markerRef.current.setLatLng([lat, lng]);
            }

            onSelectPosition({ lat, lng });
        });
        setTimeout(() => {
            mapRef.current.invalidateSize();
        }, 200); // 200ms da tiempo a que el layout termine


    }, []); // <--- SIN DEPENDENCIAS (se ejecuta solo 1 vez)

    
useEffect(() => {
    if (!mapRef.current) return;

    // Handler del click
    const handleClick = (e) => {
        if (readOnly) return; // 🚫 bloquear
        const { lat, lng } = e.latlng;

        if (!markerRef.current) {
            markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        } else {
            markerRef.current.setLatLng([lat, lng]);
        }

        onSelectPosition({ lat, lng });
    };

    // Primero remover handler anterior si existía
    mapRef.current.off("click"); 
    // Agregar solo si readOnly = false
    if (!readOnly) {
        mapRef.current.on("click", handleClick);
    }

}, [readOnly, onSelectPosition]);
    // Este efecto SOLO mueve el marcador si hay initialPosition
    useEffect(() => {
        if (!mapRef.current) return;
        if (initialPosition?.lat && initialPosition?.lng) {
            if (!markerRef.current) {
                markerRef.current = L.marker([initialPosition.lat, initialPosition.lng]).addTo(mapRef.current);
            } else {
                markerRef.current.setLatLng([initialPosition.lat, initialPosition.lng]);
            }
        }
    }, [initialPosition]);
    // Centrar el mapa cuando cambie initialPosition
    useEffect(() => {
        if (!mapRef.current) return;
        if (!initialPosition?.lat || !initialPosition?.lng) return;

        // Centrar mapa
        mapRef.current.setView(
            [initialPosition.lat, initialPosition.lng],
            16,   // zoom
            { animate: true }
        );
    }, [initialPosition]);

    return (
        <div
            ref={mapContainerRef}
            className="relative w-full h-[300px] overflow-hidden rounded-xl z-0" 
        >
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin="" />

            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                crossOrigin=""></script>
        </div>
    );
}
