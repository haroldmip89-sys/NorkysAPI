import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import * as API from "../api/direcciones.js";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import { ReportTable } from "../tables/ReportTable.jsx";

export function MyAddress() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const idUsuario = usuario.idUsuario;

  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      const data = await API.getAllById(idUsuario);
      setLista(data || []);
      setLoading(false);
    };
    cargar();
  }, []);

  function deleteAddress(idDireccion, tituloDireccion) {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar la dirección "${tituloDireccion}"?`
    );

    if (!confirmar) {
      return; // Usuario canceló
    }
    API.deleteDireccion(idDireccion).then(response => {
      if (response) {
        Swal.fire({
          title: "Éxito",
          text: "ℹ️ Dirección " + tituloDireccion + " actualizada con éxito",
          icon: "success",
        });
        //toast.info('ℹ️ Direccion '+tituloDireccion+' eliminado correctamente')
        //Actualizar la lista de direcciones
        API.getAllById(idUsuario).then(setLista);
      } else {
        toast.error('❌ Error al eliminar la direccion  ' + tituloDireccion)
      }
    })
  }

  return (
    <>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Mis direcciones
            </h2>
            <p className="text-sm text-gray-500">
              Administra tus direcciones de entrega
            </p>
          </div>

          <Link
            to="/my-account/new-address"
            className="px-4 py-2 rounded-lg text-sm font-medium
                     norkys-bg-naranja text-white hover:opacity-90 transition"
          >
            + Agregar dirección
          </Link>
        </div>

        {/* ESTADOS */}
        {loading && (
          <p className="text-sm text-gray-500">Cargando direcciones…</p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* TABLA */}
        {lista.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-sm overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Título</th>
                  <th className="px-4 py-3 text-left font-semibold">Dirección</th>
                  <th className="px-4 py-3 text-left font-semibold">Referencia</th>
                  <th className="px-4 py-3 text-left font-semibold">Teléfono</th>
                  <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {lista.map(item => (
                  <tr
                    key={item.idDireccion}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.tituloDireccion}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.direccion}
                    </td>

                    <td className="px-4 py-3 text-gray-500">
                      {item.referencia || "—"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.telefono1}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-4">

                        {/* EDITAR */}
                        <Link
                          to={`/my-account/address/${item.idDireccion}`}
                          className="text-gray-600 hover:text-blue-600 transition"
                          title="Editar dirección"
                        >
                          <FiEdit size={18} />
                        </Link>

                        {/* ELIMINAR */}
                        <button
                          onClick={() =>
                            deleteAddress(item.idDireccion, item.tituloDireccion)
                          }
                            className="text-gray-600 hover:text-red-600 transition"
                          title="Eliminar dirección"
                        >
                          <FiTrash2 size={18} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-sm text-gray-500">
              No tienes direcciones registradas.
            </p>
          )
        )}
      </div>
    </>
  );
}
/*
opcion de Report table
{lista.length > 0 ? (
  <ReportTable
    headers={[
      "idDireccion",
      "idUsuario",
      "tituloDireccion",
      "referencia",
      "direccion",
      "telefono1",
      "telefono2",
      "latY",
      "longX",
      "Accion",
    ]}
    rows={lista.map((item) => [
      item.idDireccion,
      item.idUsuario,
      item.tituloDireccion,
      item.referencia,
      item.direccion,
      item.telefono1,
      item.telefono2,
      item.latY,
      item.longX,
      <>
        <button
          onClick={() =>
            deleteAddress(item.idDireccion, item.tituloDireccion)
          }
        >
          Borrar
        </button>
        {" | "}
        <Link to={`/my-account/address/${item.idDireccion}`}>
          <button>Editar</button>
        </Link>
      </>,
    ])}
  />
) : (
  !loading &&
  !error &&
  <p>No hay resultados para este usuario.</p>
)}

*/