import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [talleSeleccionado, setTalleSeleccionado] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        // Forzamos el scroll arriba al entrar al detalle
        window.scrollTo(0, 0);

        api.get(`/Productos/${id}`)
            .then(res => setProducto(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!producto) return <div className="text-center py-20 font-bold">Cargando...</div>;

    const talles = producto.talles
        ? producto.talles.split(',').map(t => t.trim()).filter(t => t !== "")
        : [];

    const isSinStock = producto.stock <= 0;

    const handleAgregar = () => {
        if (isSinStock) return; // Seguridad extra

        if (talles.length > 0 && !talleSeleccionado) {
            toast.error("⚠️ Por favor selecciona un talle");
            return;
        }
        addToCart(producto, talleSeleccionado);
        toast.success("Producto agregado al carrito 🛒");
    };

    const getImagenUrl = (url) => {
        if (!url) return "/img/default_product.png";
        if (url.startsWith("http")) return url;
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${url}`;
    };

    return (
        <div className="min-h-screen bg-white py-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center h-[500px] relative">
                    <img
                        src={getImagenUrl(producto.imagenUrl)}
                        alt={producto.nombre}
                        className={`w-full h-full object-cover ${isSinStock ? 'grayscale opacity-50' : ''}`}
                    />
                    {isSinStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black text-white px-6 py-2 font-black uppercase text-2xl -rotate-12 border-4 border-white">Sin Stock</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center">
                    <span className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-2">{producto.categoriaProducto}</span>
                    <h1 className="text-4xl font-black uppercase mb-4 leading-none">{producto.nombre}</h1>
                    <p className="text-3xl font-bold text-gray-900 mb-6">${producto.precio.toLocaleString()}</p>
                    <p className="text-gray-600 mb-8 leading-relaxed">{producto.descripcion}</p>

                    {talles.length > 0 && !isSinStock && (
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

                    <button
                        onClick={handleAgregar}
                        disabled={isSinStock}
                        className={`w-full py-4 rounded font-bold uppercase tracking-widest transition shadow-lg text-lg
                            ${isSinStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {isSinStock ? 'PRODUCTO AGOTADO' : 'AGREGAR AL CARRITO'}
                    </button>

                    <Link to="/tienda" className="block text-center mt-6 text-sm font-bold underline hover:text-gray-600">Seguir Comprando</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;