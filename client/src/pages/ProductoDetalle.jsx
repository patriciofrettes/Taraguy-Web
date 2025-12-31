import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios'; // <--- IMPORTANTE
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [talleSeleccionado, setTalleSeleccionado] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        // Usamos api.get en lugar de axios.get
        api.get(`/Productos/${id}`)
            .then(res => setProducto(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!producto) return <div className="text-center py-20 font-bold">Cargando...</div>;

    const talles = producto.talles
        ? producto.talles.split(',').map(t => t.trim()).filter(t => t !== "")
        : [];

    const handleAgregar = () => {
        if (talles.length > 0 && !talleSeleccionado) {
            toast.error("⚠️ Por favor selecciona un talle");
            return;
        }
        addToCart(producto, talleSeleccionado);
        toast.success("Producto agregado al carrito 🛒");
    };

    // FUNCIÓN AUXILIAR PARA IMÁGENES
    // Esto detecta si la imagen es local o viene de la nube
    const getImagenUrl = (url) => {
        if (!url) return "/img/default_product.png";
        if (url.startsWith("http")) return url; // Ya es una URL completa
        // Si es relativa, usamos la base del API (pero quitando el '/api' final para las fotos)
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${url}`;
    };

    return (
        <div className="min-h-screen bg-white py-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center h-[500px]">
                    <img
                        src={getImagenUrl(producto.imagenUrl)}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-2">{producto.categoriaProducto}</span>
                    <h1 className="text-4xl font-black uppercase mb-4 leading-none">{producto.nombre}</h1>
                    <p className="text-3xl font-bold text-gray-900 mb-6">${producto.precio.toLocaleString()}</p>
                    <p className="text-gray-600 mb-8 leading-relaxed">{producto.descripcion}</p>

                    {talles.length > 0 && (
                        <div className="mb-8">
                            <p className="font-bold text-sm uppercase mb-3 text-black">Seleccioná tu talle:</p>
                            <div className="grid grid-cols-4 gap-3">
                                {talles.map(talle => (
                                    <button
                                        key={talle}
                                        onClick={() => setTalleSeleccionado(talle)}
                                        className={`py-3 text-sm font-bold border rounded transition-all uppercase
                                            ${talleSeleccionado === talle ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'}`}
                                    >
                                        {talle}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={handleAgregar} className="w-full bg-blue-600 text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-blue-700 transition shadow-lg text-lg">
                        AGREGAR AL CARRITO
                    </button>
                    <Link to="/tienda" className="block text-center mt-6 text-sm font-bold underline hover:text-gray-600">Seguir Comprando</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;