import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as API from "../api/items.js";
import { ItemForm } from "./ItemForm.jsx"
import { toast } from "react-toastify";
export function EditItem() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    useEffect(() => {
        API.getItemById(id).then(setItem);
    }, [id]);

    async function handleUpdate(formData) {
        const res = await API.updateItem(id, formData);
        if (res) {
            Swal.fire({
                title: "Éxito",
                text: "Item actualizado correctamente",
                icon: "success",
            });
            navigate("/admin/items");
        }
    }

    if (!item) return <p>Cargando...</p>;
    return (
        <><div className="p-4 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Editar item {id}</h2>
            <ItemForm item={item} onSubmit={handleUpdate} />
        </div>
        </>
    )
}