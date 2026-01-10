import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- CAMBIO: Usamos navigate
import axios from 'axios';

const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Tienda = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate(); // <--- Inicializamos el navegador

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

    const getImagenUrl = (url) => {
        if (!url) return "/img/default_product.png";
        if (url.startsWith("http")) return url;
        return `${API_URL}${url}`;
    };

    // FUNCIÓN DE CLIC ROBUSTA
    const handleVerDetalle = (id) => {
        if (!id) {
            alert("Error: El producto no tiene un ID válido.");
            return;
        }
        console.log("Navegando al producto:", id);
        navigate(`/producto/${id}`); // <--- Esto coincide con tu App.jsx
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-10 uppercase tracking-tighter italic">Tienda Oficial</h1>

                {cargando ? (
                    <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Cargando catálogo...</div>
                ) : productos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {productos.map((prod) => (
                            <div key={prod.id} className="bg-white rounded-xl shadow-md overflow-hidden group border border-gray-100 flex flex-col">
                                <div className="h-64 overflow-hidden relative bg-gray-100">
                                    <img
                                        src={getImagenUrl(prod.imagenUrl)}
                                        alt={prod.nombre}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        onError={(e) => e.target.src = "/img/default_product.png"}
                                    />
                                    {prod.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-black border-2 border-white px-3 py-1 uppercase -rotate-12">Sin Stock</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-black text-lg uppercase mb-1 leading-tight">{prod.nombre}</h3>
                                        <p className="text-green-600 font-black text-2xl mb-4">${prod.precio.toLocaleString()}</p>
                                    </div>

                                    {/* BOTÓN CON MANEJADOR DE EVENTO */}
                                    <button
                                        onClick={() => handleVerDetalle(prod.id)}
                                        className="w-full bg-black text-white py-4 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg active:scale-95"
                                    >
                                        Ver Detalle
                                    </button>
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