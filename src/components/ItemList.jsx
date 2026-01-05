import { use, useEffect, useState } from "react";
import { Header } from "../layout/Header.jsx";
import { Footer } from "../layout/Footer.jsx";
import { Link } from "react-router-dom";
import * as API from '../api/items.js';
import * as API_Cat from '../api/categorias.js';
import * as API_WishList from '../api/whishlist.js';
import { useMemo } from "react";
import { ItemCard } from "../layout/ItemCard.jsx";
import logo from '../assets/Norkys-icon.png';

export function ItemList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [mapCat, setMapCat] = useState({}); // id -> nombre
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
    const [wishList, setWishList] = useState([]);
    const usuario = useMemo(() => {
        const stored = sessionStorage.getItem("usuario");
        return stored ? JSON.parse(stored) : null;
    }, []);

    //paginacion, 10 por pagina
    const itemsPerPage = 12;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);
    //pageItem sera la lista para hacer map
    const pageItems = items.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    //cargar categorias
    useEffect(() => {
        API_Cat.getCategorias().then((cats) => {
            setCategorias(cats);
            const m = {};
            cats.forEach(c => { m[c.idCategoria] = c.nombre; });
            setMapCat(m);
            setLoading(false);
        });
    }, []);
    //cargar items
    useEffect(() => {
        if (categoriaSeleccionada === "Todos") {
            API.getItems().then(setItems);
        } else {
            API.getItemsByCategoria(categoriaSeleccionada).then(setItems);
        }
    }, [categoriaSeleccionada]);


    //cargar items de la wishlist
    useEffect(() => {
        if (!usuario || usuario.esAdmin) return;

        API_WishList.getAllById(usuario.idUsuario).then((lista) => {
            if (!lista) return;
            //console.log("Wishlist cruda del backend:", lista);
            const mapped = lista.map(w => ({
                idWishListItem: w.idWishList,   // 👈 NOMBRE EXACTO DEL BACKEND
                idItem: w.idItem
            }));
            //console.log("Wishlist mapeada:", mapped);
            setWishList(mapped);
        });
    }, [usuario]);

    //funcion para agregar o quitar item de la wishlist
    async function handleToggleWishlist(idItem) {
        if (!usuario) return alert("Debe iniciar sesión");
        const existing = wishList.find(w => w.idItem === idItem);
        //console.log("Item a borrar:", existing);
        if (existing) {
            //console.log("ID que se envía al DELETE:", existing.idWishListItem);
            const ok = await API_WishList.deleteItem(existing.idWishListItem);
            if (ok) {
                setWishList(prev => prev.filter(w => w.idItem !== idItem));
            }
            return;
        }

        const body = { idUsuario: usuario.idUsuario, idItem };
        const res = await API_WishList.createItem(body);
        const lista = await API_WishList.getAllById(usuario.idUsuario);
        //console.log("API devuelve:", res);
        const mapped = lista.map(w => ({
            idWishListItem: w.idWishList,
            idItem: w.idItem
        }));
        setWishList(mapped);
    }

    if (loading) return <><p>Cargando...</p></>

    return (
        <>
            <Header></Header>
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-10">

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Lista de Productos
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                        <button
                            onClick={() => setCategoriaSeleccionada("Todos")}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition
                ${categoriaSeleccionada === "Todos"
                                    ? "bg-orange-50 border-orange-500"
                                    : "bg-white hover:shadow-md"}
            `}
                        >
                            <img src={logo} alt="Todos" className="w-8 h-8 object-contain" />
                            <span className="text-sm font-medium">Todos</span>
                        </button>

                        {categorias.map(cat => (
                            <button
                                key={cat.idCategoria}
                                onClick={() => setCategoriaSeleccionada(cat.idCategoria)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition
                    ${categoriaSeleccionada === cat.idCategoria
                                        ? "bg-orange-50 border-orange-500"
                                        : "bg-white hover:shadow-md"}
                `}
                            >
                                <img
                                    src={logo}
                                    alt={cat.nombre}
                                    className="w-8 h-8 object-contain"
                                />
                                <span className="text-sm font-medium">
                                    {cat.nombre}
                                </span>
                            </button>
                        ))}

                    </div>
                </div>


                <br /><br />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {pageItems.map(item => (
                        <ItemCard
                            key={item.idItem}
                            item={item}
                            categoria={mapCat[item.idCategoria]}
                            usuario={usuario}
                            isFavorite={wishList.some(w => w.idItem === item.idItem)}
                            onToggleWishlist={handleToggleWishlist}
                        />
                    ))}
                </div>
                {/*Paginacion*/}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100"
                    >
                        Anterior
                    </button>

                    <span className="text-sm">
                        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100"
                    >
                        Siguiente
                    </button>
                </div>
            </main>

            <Footer />
        </>
    );
}