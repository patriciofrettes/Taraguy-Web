import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7235/api/Noticias')
            .then((response) => {
                setNoticias(response.data);
            })
            .catch((error) => {
                console.error("Error cargando noticias:", error);
            });
    }, []);

    // 🔧 FUNCIÓN INTELIGENTE: Decide de dónde sacar la foto
    const obtenerImagen = (ruta) => {
        if (!ruta) return "/img/default.jpg"; // Si no hay ruta, foto por defecto

        // Si la ruta empieza con "/uploads", significa que está en el BACKEND
        if (ruta.startsWith("/uploads")) {
            return `https://localhost:7235${ruta}`;
        }

        // Si no, es una foto local (/img/...) o de internet, la dejamos igual
        return ruta;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200 pb-5 mb-10">
                    <h1 className="text-3xl font-black text-black uppercase tracking-tight">
                        Todas las Noticias
                    </h1>
                </div>

                {noticias.length === 0 ? (
                    <p className="text-gray-500">Cargando novedades...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {noticias.map((noticia) => (
                            <div key={noticia.id} className="bg-white shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer">

                                <Link to={`/noticias/${noticia.id}`} className="block h-full flex flex-col">
                                    <div className="h-60 overflow-hidden bg-gray-200 relative">
                                        {/* USAMOS LA FUNCIÓN AQUÍ ABAJO 👇 */}
                                        <img
                                            src={obtenerImagen(noticia.imagenUrl)}
                                            alt={noticia.titulo}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = "/img/default.jpg"; }}
                                        />
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    </div>

                                    <div className="p-6 border-t-4 border-black flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 leading-none mb-3 uppercase group-hover:text-red-700 transition-colors">
                                            {noticia.titulo}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 font-medium flex-grow">
                                            {noticia.copete}
                                        </p>
                                        <div className="mt-auto">
                                            <span className="inline-block bg-black text-white text-xs font-bold px-4 py-2 uppercase tracking-widest group-hover:bg-red-700 transition-colors">
                                                Leer Noticia
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Noticias;