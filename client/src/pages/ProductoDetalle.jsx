import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const ProductoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, openCart } = useCart();
    const [producto, setProducto] = useState(null);
    const [talleSeleccionado, setTalleSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api.get(`/Productos/${id}`)
            .then(res => {
                setProducto(res.data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando producto", err);
                setCargando(false);
            });
    }, [id]);

    const handleAgregar = () => {
        // Si el producto tiene talles (ej. indumentaria) y no eligió uno, avisamos
        if (producto.categoria === "Indumentaria" && !talleSeleccionado) {
            alert("Por favor, selecciona un talle antes de agregar.");
            return;
        }

        addToCart(producto, talleSeleccionado);
        openCart(); // Abre el sidebar para que el usuario vea que se agregó
    };

    if (cargando) return <div className="text-center py-20 font-black uppercase">Cargando...</div>;
    if (!producto) return <div className="text-center py-20 uppercase font-black">Producto no encontrado</div>;

    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Imagen */}
                <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
                    <img
                        src={producto.imagenUrl ? `https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net${producto.imagenUrl}` : '/img/default_product.png'}
                        className="w-full h-full object-contain"
                        alt={producto.nombre}
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">{producto.categoria}</span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">{producto.nombre}</h1>
                    <p className="text-3xl font-black text-gray-900 mb-6">${producto.precio.toLocaleString()}</p>
                    <p className="text-gray-500 mb-8 leading-relaxed">{producto.descripcion}</p>

                    {/* Talles - Solo si es indumentaria */}
                    <div className="mb-8">
                        <p className="font-black uppercase text-xs tracking-widest mb-4">Seleccioná tu talle:</p>
                        <div className="flex gap-3">
                            {['S', 'M', 'L', 'XL'].map(talle => (
                                <button
                                    key={talle}
                                    onClick={() => setTalleSeleccionado(talle)}
                                    className={`w-14 h-14 border-2 font-black transition-all rounded-lg ${talleSeleccionado === talle ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black'}`}
                                >
                                    {talle}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleAgregar}
                        className="w-full bg-blue-600 text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-xl active:scale-95"
                    >
                        Agregar al Carrito
                    </button>

                    <button onClick={() => navigate('/tienda')} className="mt-6 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-black">
                        Seguir Comprando
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;