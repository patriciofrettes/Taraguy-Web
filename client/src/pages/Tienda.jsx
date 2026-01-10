import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- AGREGADO
import axios from 'axios';

// URL BASE
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Tienda = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/Productos`);
                setProductos(response.data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarProductos();
    }, []);

    // Helper para las imágenes (Misma lógica que en ProductoDetalle)
    const getImagenUrl = (url) => {
        if (!url) return "/img/default_product.png";
        if (url.startsWith("http")) return url;
        return `${API_URL}${url}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-10 uppercase tracking-tighter">
                    Tienda Oficial
                </h1>

                {cargando ? (
                    <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Cargando productos...</div>
                ) : productos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {productos.map((prod) => (
                            <div key={prod.id} className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group border border-gray-100">
                                <div className="h-64 overflow-hidden relative bg-gray-200">
                                    <img
                                        src={getImagenUrl(prod.imagenUrl)}
                                        alt={prod.nombre}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        onError={(e) => e.target.src = "/img/default_product.png"}
                                    />
                                    {prod.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-bold border-2 border-white px-3 py-1 uppercase -rotate-12">Sin Stock</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-black text-lg uppercase mb-1 leading-tight h-12 overflow-hidden">{prod.nombre}</h3>
                                    <p className="text-green-600 font-black text-2xl mb-4">${prod.precio.toLocaleString()}</p>

                                    {/* --- BOTÓN CORREGIDO: Ahora es un Link real --- */}
                                    <Link
                                        to={`/producto/${prod.id}`}
                                        className="block w-full text-center bg-black text-white py-3 rounded font-bold uppercase text-xs tracking-widest hover:bg-yellow-500 hover:text-black transition-all duration-300"
                                    >
                                        Ver Detalle
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl uppercase tracking-widest">
                        No hay productos disponibles actualmente.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tienda;