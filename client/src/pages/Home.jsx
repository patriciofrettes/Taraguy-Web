import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// URL BASE LIMPIA
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Home = () => {
    const [ultimaNoticia, setUltimaNoticia] = useState(null);
    const [proximoPartido, setProximoPartido] = useState(null);

    useEffect(() => {
        // 1. Cargar la última noticia
        axios.get(`${API_URL}/api/Noticias/ultimas`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setUltimaNoticia(res.data[0]);
                }
            })
            .catch(err => console.error("Error cargando noticias:", err));

        // 2. Cargar el próximo partido
        axios.get(`${API_URL}/api/Partidos/proximo`)
            .then(res => {
                if (res.data) {
                    setProximoPartido(res.data);
                }
            })
            .catch(err => console.error("Error cargando partidos:", err));
    }, []);

    const obtenerImagen = (ruta) => {
        if (!ruta) return "/img/default_news.png";
        if (ruta.startsWith("/uploads")) return `${API_URL}${ruta}`;
        return ruta;
    };

    return (
        <div className="font-sans text-gray-900 bg-white">

            {/* HEADER */}
            <div className="bg-black text-white py-20 px-4 text-center">
                <img src="/img/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-6 object-contain" onError={(e) => e.target.style.display = 'none'} />
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Taraguy Rugby Club</h1>
                <p className="text-xl text-gray-400 uppercase tracking-widest mb-8">Corrientes - Argentina</p>
                <Link to="/tienda" className="bg-white text-black px-8 py-3 rounded-full font-black uppercase hover:bg-gray-200 transition">
                    Ir a la Tienda
                </Link>
            </div>

            {/* SECCIÓN PRÓXIMO PARTIDO */}
            {proximoPartido && (
                <div className="bg-yellow-400 py-8 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-xl font-black uppercase mb-4">Próximo Encuentro</h2>
                        <div className="bg-black text-white p-6 rounded-xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-3xl font-black uppercase">Taraguy RC</div>
                            <div className="text-gray-400 font-bold text-xl">VS</div>
                            <div className="text-3xl font-black uppercase">{proximoPartido.rival}</div>
                            <div className="text-sm bg-gray-800 px-4 py-2 rounded">
                                {new Date(proximoPartido.fechaHora).toLocaleString()} | {proximoPartido.lugar}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SECCIÓN NOTICIAS */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-black uppercase mb-8 border-l-8 border-black pl-4">Últimas Novedades</h2>

                {ultimaNoticia ? (
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="overflow-hidden rounded-xl shadow-lg">
                            <img
                                src={obtenerImagen(ultimaNoticia.imagenUrl)}
                                alt={ultimaNoticia.titulo}
                                className="w-full h-96 object-cover hover:scale-105 transition duration-700"
                                onError={(e) => e.target.src = "https://via.placeholder.com/800x400?text=Noticia"}
                            />
                        </div>
                        <div>
                            <span className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-2 block">
                                {new Date(ultimaNoticia.fechaPublicacion).toLocaleDateString()}
                            </span>
                            <h3 className="text-4xl font-black leading-tight mb-4">{ultimaNoticia.titulo}</h3>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                {ultimaNoticia.copete}
                            </p>
                            <Link to="/noticias" className="bg-black text-white px-6 py-3 font-bold uppercase rounded hover:bg-gray-800 transition inline-block">
                                Leer más
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 bg-gray-50 text-center border-2 border-dashed border-gray-300 rounded-xl">
                        <p className="text-gray-500 font-bold">No hay noticias cargadas aún.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;