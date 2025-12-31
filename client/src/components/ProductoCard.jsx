import { Link } from 'react-router-dom';
import api from '../api/axios'; // Importamos para leer la URL base

const ProductoCard = ({ producto }) => {

    // Helper para armar la URL de la imagen
    const getImagenUrl = (url) => {
        if (!url) return "/img/default_product.png";
        if (url.startsWith("http")) return url;
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${url}`;
    };

    return (
        <Link to={`/producto/${producto.id}`} className="block group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300">
                <div className="h-64 overflow-hidden relative bg-gray-100">
                    <img
                        src={getImagenUrl(producto.imagenUrl)}
                        alt={producto.nombre}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    {producto.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="text-white font-bold border-2 border-white px-3 py-1 uppercase transform -rotate-12">Sin Stock</span>
                        </div>
                    )}
                </div>
                <div className="p-5 text-center">
                    <h3 className="text-lg font-black uppercase mb-2">{producto.nombre}</h3>
                    <p className="text-xl font-bold text-gray-900 mb-4">${producto.precio.toLocaleString()}</p>
                    <span className="inline-block bg-black text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider group-hover:bg-yellow-500 group-hover:text-black transition">
                        Ver Producto
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductoCard;