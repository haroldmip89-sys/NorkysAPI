import { Link } from "react-router-dom";

export function NoPermission() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-xl p-8 max-w-md text-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ocurrió un error</h2>
                <p className="text-gray-600 mb-6">
                    No tienes permiso para acceder a esta página.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 norkys-bg-verde text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
                >
                    Volver al listado
                </Link>
            </div>
        </div>
    );
}
