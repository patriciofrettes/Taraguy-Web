import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/api/Noticias`)
            .then(res => {
                setNoticias(res.data);
                setCargando(false);
            })
            .catch(e => {
                console.error(e);
                setCargando(false);
            });
    }, []);

    const getImagen = (ruta) => {
        if (!ruta) return "/img/default_news.png";
        if (ruta.startsWith("http")) return ruta;
        return `${API_URL}${ruta}`;
    };

    if (cargando) return <div className="text-center py-20 font-bold text-xl">Cargando noticias...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">Todas las Noticias</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {noticias.map(n => (
                        <div key={n.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition duration-300">
                            <div className="h-56 overflow-hidden bg-gray-200 relative">
                                <img
                                    src={getImagen(n.imagenUrl)}
                                    alt={n.titulo}
                                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                    // QUITAMOS EL PLACEHOLDER EXTERNO
                                    onError={(e) => { e.target.style.opacity = 0; }}
                                />
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">
                                    {new Date(n.fechaPublicacion).toLocaleDateString()}
                                </p>
                                <h3 className="text-xl font-black leading-tight mb-3 uppercase">{n.titulo}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{n.copete}</p>
                                <Link to={`/noticias/${n.id}`} className="bg-black text-white text-center py-2 rounded font-bold uppercase text-sm hover:bg-gray-800 transition">
                                    Leer Noticia
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Noticias;