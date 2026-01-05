import { useState, useEffect } from "react";

export function ItemForm({ item, onSubmit, showCategoria = false, categorias = [] }) {
  const [form, setForm] = useState(item || {});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (item?.imagenUrl) {
      setPreview(`${import.meta.env.VITE_API_URL}${item.imagenUrl}`);
    }
  }, [item]);

  useEffect(() => {
    if (showCategoria && categorias.length > 0 && !form.idCategoria) {
      setForm(prev => ({
        ...prev,
        idCategoria: categorias[0].idCategoria
      }));
    }
  }, [categorias, showCategoria, form.idCategoria]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("precio", form.precio);
    formData.append("idCategoria", form.idCategoria);

    if (file) {
      formData.append("imagen", file);
    }

    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Imagen previa */}
      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="w-64 h-auto rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          name="nombre"
          required
          value={form.nombre || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          required
          value={form.descripcion || ""}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Precio
        </label>
        <input
          type="number"
          name="precio"
          required
          value={form.precio || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Categoría */}
      {showCategoria && categorias.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="idCategoria"
            value={form.idCategoria}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring focus:ring-blue-200"
          >
            {categorias.map(cat => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagen
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          className="w-full text-sm text-gray-600"
        />
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="norkys-bg-verde hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
