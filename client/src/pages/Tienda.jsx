import { useState, useEffect } from 'react';
import axios from 'axios';

// URL BASE
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Tienda = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                console.log("Intentando conectar a:", API_URL); // Log para debug
                const response = await axios.get(`${API_URL}/api/Productos`);

                console.log("Datos recibidos:", response.data); // Log para ver qué llega

                // --- CAMBIO: NO FILTRAMOS NADA, MOSTRAMOS TODO ---
                setProductos(response.data);

            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarProductos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-10 uppercase tracking-tighter">
                    Tienda Oficial
                </h1>

                {cargando ? (
                    <div className="text-center py-20 text-gray-500 font-bold">Cargando productos...</div>
                ) : productos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {productos.map((prod) => (
                            <div key={prod.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group">
                                <div className="h-64 overflow-hidden relative bg-gray-200">
                                    <img
                                        src={prod.imagenUrl ? `${API_URL}${prod.imagenUrl}` : '/img/default_product.png'}
                                        alt={prod.nombre}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        onError={(e) => e.target.src = "https://via.placeholder.com/300?text=Sin+Foto"}
                                    />
                                    {/* Si el stock es 0, mostramos cartel */}
                                    {prod.stock === 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                            <span className="text-white font-bold border-2 border-white px-3 py-1 uppercase">Sin Stock</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg uppercase mb-1">{prod.nombre}</h3>
                                    <p className="text-gray-500 text-xs mb-2 line-clamp-2">{prod.descripcion}</p>
                                    <p className="text-green-600 font-black text-xl">${prod.precio}</p>
                                    <button className="w-full mt-4 bg-black text-white py-2 rounded font-bold uppercase text-sm hover:bg-gray-800 transition">
                                        Ver Detalle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 font-bold border-2 border-dashed border-gray-300 rounded-xl">
                        No hay productos disponibles (Array vacío).
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tienda;