import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// URL BASE
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Home = () => {
    // --- ESTADOS ---
    const [noticias, setNoticias] = useState([]);
    const [proximoPartido, setProximoPartido] = useState(null);
    const [sponsors, setSponsors] = useState([]);
    const [cargando, setCargando] = useState(true);

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // 1. Cargar Noticias
                const resNoticias = await axios.get(`${API_URL}/api/Noticias`);
                const ultimasNoticias = resNoticias.data
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .slice(0, 3);
                setNoticias(ultimasNoticias);

                // 2. Cargar Partidos (CORREGIDO CON TUS CAMPOS REALES)
                try {
                    const resPartidos = await axios.get(`${API_URL}/api/Partidos`);
                    const hoy = new Date();

                    // Filtramos partidos que sean HOY o en el FUTURO
                    const siguientes = resPartidos.data
                        .filter(p => new Date(p.fechaHora) >= hoy)
                        .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

                    // Tomamos el primero (el más cercano)
                    if (siguientes.length > 0) {
                        setProximoPartido(siguientes[0]);
                    }
                } catch (error) {
                    console.error("No se pudieron cargar partidos:", error);
                }

                // 3. Cargar Sponsors (CORREGIDO CON TUS CAMPOS REALES)
                try {
                    const resSponsors = await axios.get(`${API_URL}/api/Sponsors`);
                    // Filtramos solo los activos
                    const sponsorsActivos = resSponsors.data.filter(s => s.activo === true);
                    setSponsors(sponsorsActivos);
                } catch (error) {
                    console.error("No se pudieron cargar sponsors:", error);
                }

            } catch (error) {
                console.error("Error general cargando home:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    // Helper para arreglar URLs de imágenes
    const getImagenUrl = (url) => {
        if (!url) return "/img/default_news.jpg";
        if (url.startsWith("http")) return url;
        // Si viene con barra inicial (ej: /img/...) concatenamos, si no, agregamos barra
        return url.startsWith("/") ? `${API_URL}${url}` : `${API_URL}/${url}`;
    };

    // Helper para formato de fecha de partido
    const formatearFechaPartido = (fechaString) => {
        if (!fechaString) return "Fecha a confirmar";
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + " hs";
    };

    return (
        <div className="font-sans text-gray-900 bg-white">

            {/* Header manejado por App.jsx */}

            {/* =========================================
                1. SECCIÓN PRÓXIMO PARTIDO (AUTOMÁTICO)
               ========================================= */}
            {proximoPartido ? (
                <div className="bg-zinc-900 text-white py-12 px-6 border-b-4 border-black">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-zinc-800 p-8 rounded-lg shadow-2xl border border-zinc-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                            <div className="text-center md:text-left z-10">
                                <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-1">Próximo Encuentro</h3>
                                <p className="text-3xl font-black italic">EL CLÁSICO</p>
                            </div>

                            <div className="flex items-center gap-6 md:gap-16 z-10">
                                {/* LOCAL (Siempre Taraguy) */}
                                <div className="text-center group">
                                    <img src="/img/logo.png" alt="Taraguy" className="h-20 w-20 md:h-24 md:w-24 object-contain mx-auto mb-3 transition transform group-hover:scale-110" />
                                    <span className="font-bold text-xl block tracking-tighter">TARAGUY</span>
                                </div>

                                <div className="text-5xl font-black text-zinc-600 italic">VS</div>

                                {/* RIVAL (Dinámico) */}
                                <div className="text-center group">
                                    <div className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-3 flex items-center justify-center transition transform group-hover:scale-110">
                                        <img
                                            src={getImagenUrl(proximoPartido.escudoRivalUrl)}
                                            alt={proximoPartido.rival}
                                            className="h-full w-full object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentNode.innerHTML = '<div class="h-20 w-20 bg-gray-600 rounded-full flex items-center justify-center font-bold text-2xl text-white">?</div>';
                                            }}
                                        />
                                    </div>
                                    <span className="font-bold text-xl block tracking-tighter uppercase">{proximoPartido.rival}</span>
                                </div>
                            </div>

                            <div className="text-center md:text-right z-10">
                                {/* Usamos fechaHora */}
                                <p className="text-lg font-bold text-white mb-1 capitalize">
                                    {formatearFechaPartido(proximoPartido.fechaHora)}
                                </p>
                                <p className="text-gray-400 text-sm flex items-center justify-center md:justify-end gap-2 uppercase tracking-wide">
                                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {proximoPartido.lugar === "Local" ? "Cancha Taraguy RC" : "Visitante"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* MENSAJE SI NO HAY PARTIDOS FUTUROS */
                <div className="bg-zinc-900 text-white py-8 text-center border-b-4 border-black">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        No hay partidos programados próximamente
                    </p>
                </div>
            )}

            {/* =========================================
                2. SECCIÓN NOTICIAS (AUTOMÁTICO)
               ========================================= */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black italic text-black mb-2 tracking-tighter">ÚLTIMAS NOVEDADES</h2>
                        <div className="h-2 w-24 bg-black"></div>
                    </div>
                    <Link to="/noticias" className="hidden md:block text-gray-500 font-bold uppercase tracking-widest hover:text-black transition-colors text-sm border-b-2 border-transparent hover:border-black pb-1">
                        Ver todas las noticias &rarr;
                    </Link>
                </div>

                {cargando ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest">Cargando...</p>
                    </div>
                ) : noticias.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {noticias.map((noticia) => (
                            <Link to={`/noticias/${noticia.id}`} key={noticia.id} className="group cursor-pointer">
                                <div className="overflow-hidden rounded-lg shadow-lg mb-4 h-64 bg-gray-200 relative">
                                    <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-lg">
                                        Novedades
                                    </div>
                                    <img
                                        src={getImagenUrl(noticia.imagenUrl)}
                                        alt={noticia.titulo}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => e.target.src = "/img/default_news.jpg"}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest block mb-2">
                                    {new Date(noticia.fecha).toLocaleDateString()}
                                </span>
                                <h3 className="text-2xl font-black leading-none mb-3 group-hover:text-gray-700 transition-colors uppercase italic">
                                    {noticia.titulo}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2">
                                    {noticia.copete || "Leer más..."}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
                        <p className="text-gray-400 font-bold">No hay noticias cargadas.</p>
                    </div>
                )}

                <div className="mt-10 md:hidden text-center">
                    <Link to="/noticias" className="inline-block border-2 border-black text-black px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all w-full">
                        Ver más noticias
                    </Link>
                </div>
            </div>

            {/* =========================================
                3. SECCIÓN SPONSORS (AUTOMÁTICO)
               ========================================= */}
            <div className="bg-gray-100 py-16 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h4 className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs mb-10">
                        NOS ACOMPAÑAN
                    </h4>

                    {sponsors.length > 0 ? (
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                            {sponsors.map((sponsor) => (
                                <div key={sponsor.id} className="opacity-60 grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-110 cursor-pointer">
                                    {/* Usamos logoUrl */}
                                    {sponsor.logoUrl ? (
                                        <img
                                            src={sponsor.logoUrl}
                                            alt={sponsor.nombre}
                                            className="h-12 md:h-16 w-auto object-contain"
                                            title={sponsor.nombre}
                                        />
                                    ) : (
                                        <div className="text-2xl font-black text-gray-400 select-none">{sponsor.nombre}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="text-3xl font-black text-gray-400 select-none">TARAGUY RC</div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Home;