import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import * as API from "../api/whishlist.js";
import { FiTrash2, FiEye } from "react-icons/fi";

export function WishList() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const idUsuario = usuario.idUsuario;
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      if (!idUsuario) return;
        const cargar = async () => {
          setLoading(true);
          const data = await API.getAllById(idUsuario);
          setLista(data || []);
          setLoading(false);
        };
        cargar();
      }, []);

  function deleteItem(idItem,nombreItem){
          const confirmar = window.confirm(
              `¿Estás seguro de que deseas eliminar el item "${nombreItem}"?`
          );
  
          if (!confirmar) {
              return; // Usuario canceló
          }
          API.deleteItem(idItem).then(response=>{
              if(response){
                  Swal.fire({
                    title: "Éxito",
                    text: nombreItem+" ha sido eliminado de la wishlist",
                    icon: "success",
                });
                  //Actualizar la lista de items
                  API.getAllById(idUsuario).then(setLista);
              }else{
                  Swal.fire({
                    title: "Error",
                    text: "Ocurrio un error al eliminar el item"+nombreItem,
                    icon: "error",
                });
              }
          })
      }

  return (
    <>
    
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Mi lista de deseos
        </h2>
        <p className="text-sm text-gray-500">
          Productos que te interesan
        </p>
      </div>

      {/* ESTADOS */}
      {loading && (
        <p className="text-sm text-gray-500">Cargando wishlist…</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* GRID DE TARJETAS */}
      {lista.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lista.map(item => (
            <div
              key={item.idWishList}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden
                         shadow-sm hover:shadow-md transition"
            >
              {/* IMAGEN */}
              <Link to={`/item/${item.idItem}`}>
                <img
                  src={`${import.meta.env.VITE_API_URL}${item.imagenUrl}`}
                  alt={item.nombreItem}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
              </Link>

              {/* INFO */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {item.nombreItem}
                </h3>

                <p className="text-lg font-bold text-green-600">
                  S/ {item.precio}
                </p>

                {/* ACCIONES */}
                <div className="flex justify-between items-center pt-2">
                  <Link
                    to={`/item/${item.idItem}`}
                    className="flex items-center gap-1 text-sm text-gray-600
                               hover:text-green-600 transition"
                  >
                    <FiEye size={16} />
                    Ver
                  </Link>

                  <button
                    onClick={() =>
                      deleteItem(item.idWishList, item.nombreItem)
                    }
                    className="text-gray-500 hover:text-red-600 transition"
                    title="Eliminar de wishlist"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-sm text-gray-500">
            Tu lista de deseos está vacía.
          </p>
        )
      )}
    </div>
    
    </>
  );
}
