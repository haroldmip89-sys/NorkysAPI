import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ItemForm } from "./ItemForm.jsx";
import * as API from "../api/items.js";
import * as API_Cat from "../api/categorias.js";
import { toast } from "react-toastify";

export function NewItem() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    API_Cat.getCategorias().then(setCategorias);
  }, []);

  async function handleCreate(formData) {
    const res = await API.createItem(formData);
    if (res) {
      Swal.fire({
        title: "Éxito",
        text: "Item creado correctamente",
        icon: "success",
      });
      //toast.success("Item creado correctamente");
      navigate("/admin/items");
    }
  }

  return (
    <>

      <div className="p-4 space-y-6 w-full max-w-2xl">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Añadir Item
          </h2>
          <p className="text-sm text-gray-500">
            Agrega un nuevo item al sistema
          </p>
        </div>
        <ItemForm
          onSubmit={handleCreate}
          showCategoria={true}
          categorias={categorias}
        />
      </div>

    </>
  );
}
