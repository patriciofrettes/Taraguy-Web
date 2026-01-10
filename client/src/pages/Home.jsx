import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// URL BASE
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Home = () => {
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarNoticias = async () => {
            try {
                // Traemos las noticias de la API
                const response = await axios.get(`${API_URL}/api/Noticias`);
                // Ordenamos por fecha (las más recientes primero) y tomamos las últimas 3
                const ultimasNoticias = response.data
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .slice(0, 3);
                setNoticias(ultimasNoticias);
            } catch (error) {
                console.error("Error cargando noticias en Home:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarNoticias();
    }, []);

    const getImagenUrl = (url) => {
        if (!url) return "/img/default_news.jpg";
        if (url.startsWith("http")) return url;
        return `${API_URL}${url}`;
    };

    return (
        <div className="bg-white">
            {/* Sección de Noticias */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-2 h-10 bg-black"></div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Últimas Novedades</h2>
                </div>

                {cargando ? (
                    <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">Actualizando novedades...</div>
                ) : noticias.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {noticias.map((noticia) => (
                            <div key={noticia.id} className="group cursor-pointer">
                                <div className="h-64 overflow-hidden rounded-xl mb-4 shadow-lg border border-gray-100">
                                    <img
                                        src={getImagenUrl(noticia.imagenUrl)}
                                        alt={noticia.titulo}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        onError={(e) => e.target.src = "/img/default_news.jpg"}
                                    />
                                </div>
                                <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest">
                                    {new Date(noticia.fecha).toLocaleDateString()}
                                </span>
                                <h3 className="text-xl font-black uppercase mt-2 mb-3 leading-tight group-hover:text-yellow-600 transition">
                                    {noticia.titulo}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                    {noticia.copete || noticia.contenido.substring(0, 100) + "..."}
                                </p>

                                {/* --- BOTÓN DINÁMICO --- */}
                                <Link
                                    to={`/noticias/${noticia.id}`}
                                    className="inline-block text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition"
                                >
                                    Leer Noticia →
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest">No hay noticias cargadas aún.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;