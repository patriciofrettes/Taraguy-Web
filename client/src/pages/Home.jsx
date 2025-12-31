import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [ultimaNoticia, setUltimaNoticia] = useState(null);
    const [proximoPartido, setProximoPartido] = useState(null);

    useEffect(() => {
        // 1. Cargar la última noticia (OPTIMIZADO)
        // Usamos el endpoint nuevo que solo trae las 3 últimas
        axios.get('https://localhost:7235/api/Noticias/ultimas')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    // Como ya vienen ordenadas del backend, tomamos la primera [0]
                    setUltimaNoticia(res.data[0]);
                }
            })
            .catch(err => console.error("Error cargando noticias:", err));

        // 2. Cargar el próximo partido (OPTIMIZADO)
        // Usamos el endpoint nuevo que trae UN solo partido (o nada)
        axios.get('https://localhost:7235/api/Partidos/proximo')
            .then(res => {
                // Si hay partido (res.data no es null o vacío), lo guardamos
                if (res.data) {
                    setProximoPartido(res.data);
                }
            })
            .catch(err => console.error("Error cargando partidos:", err));
    }, []);

    // Helper para arreglar rutas de imágenes
    const obtenerImagen = (ruta) => {
        if (!ruta) return "/img/default.jpg";
        if (ruta.startsWith("/uploads")) return `https://localhost:7235${ruta}`;
        return ruta;
    };

    return (
        <div className="font-sans text-gray-900 bg-white">

            {/* === 1. SECCIÓN PRÓXIMO PARTIDO (Solo aparece si hay uno) === */}
            {proximoPartido && (
                <div className="bg-white border-b border-gray-200 py-12">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">

                        {/* Info del Torneo */}
                        <div className="text-center md:text-left">
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest mb-1 text-sm">Proximo Encuentro</h3>
                            <p className="text-3xl font-black uppercase text-gray-900 leading-none mb-1">{proximoPartido.torneo || "Torneo Oficial"}</p>
                            <p className="text-gray-400 font-bold text-sm">
                                {new Date(proximoPartido.fechaHora).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} • {new Date(proximoPartido.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} Hs
                            </p>
                        </div>

                        {/* VS y Escudos */}
                        <div className="flex items-center gap-6 md:gap-12">
                            <div className="text-center group">
                                <img src="/img/logo.png" className="w-20 h-20 object-contain mx-auto mb-2 group-hover:scale-110 transition" alt="TRC" onError={(e) => e.target.src = "https://via.placeholder.com/80?text=TRC"} />
                                <span className="font-black text-xl block">TRC</span>
                            </div>

                            <div className="text-5xl font-black text-gray-200 italic">VS</div>

                            <div className="text-center group">
                                <img src={obtenerImagen(proximoPartido.escudoRivalUrl)} className="w-20 h-20 object-contain mx-auto mb-2 group-hover:scale-110 transition" alt="Rival" onError={(e) => e.target.src = "https://via.placeholder.com/80?text=RIVAL"} />
                                <span className="font-black text-xl block uppercase">{proximoPartido.rival}</span>
                            </div>
                        </div>

                        {/* Botón Acción */}
                        <Link to="/partidos" className="px-8 py-3 bg-black text-white font-bold uppercase hover:bg-gray-800 transition rounded shadow-lg text-sm tracking-wider">
                            Ver Fixture
                        </Link>
                    </div>
                </div>
            )}

            {/* === 2. GRILLA PRINCIPAL (Noticias + Banners) === */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* COLUMNA IZQUIERDA: NOTICIAS */}
                    <div>
                        <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-black block"></span> Ultimas Novedades
                        </h2>

                        {ultimaNoticia ? (
                            <div className="group cursor-pointer">
                                <div className="overflow-hidden rounded-xl mb-6 shadow-sm border border-gray-100">
                                    <img
                                        src={obtenerImagen(ultimaNoticia.imagenUrl)}
                                        alt={ultimaNoticia.titulo}
                                        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                                    />
                                </div>
                                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-2 block">
                                    {new Date(ultimaNoticia.fechaPublicacion).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <h3 className="text-3xl font-black leading-tight mb-4 group-hover:text-gray-600 transition">
                                    {ultimaNoticia.titulo}
                                </h3>
                                <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                                    {ultimaNoticia.copete}
                                </p>
                                <Link to="/noticias" className="inline-block border-b-2 border-black font-bold uppercase hover:text-gray-600 hover:border-gray-600 transition pb-1 text-sm tracking-wider">
                                    Leer nota completa
                                </Link>
                            </div>
                        ) : (
                            <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                                <p className="text-gray-400 font-bold">No hay noticias cargadas por el momento.</p>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: BANNERS (Tienda + Hockey) */}
                    <div className="flex flex-col gap-8">

                        {/* BANNER 1: TIENDA OFICIAL */}
                        <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-between relative overflow-hidden group shadow-sm hover:shadow-md transition duration-300">
                            <div className="relative z-10 w-2/3">
                                <h3 className="text-2xl font-black uppercase mb-2 text-gray-900">Tienda Oficial</h3>
                                <p className="text-gray-600 mb-6 text-sm">Camisetas, shorts y todo el merchandising oficial del club.</p>
                                <Link to="/tienda" className="bg-black text-white px-6 py-3 font-bold uppercase rounded hover:bg-gray-800 transition text-xs tracking-widest inline-block">
                                    Ir al Shop
                                </Link>
                            </div>
                            {/* Imagen decorativa tienda (camiseta) */}
                            <img
                                src="https://flash-sport.com.ar/wp-content/uploads/2021/03/Camiseta-Rugby-Taraguy-Titular-Frente.jpg"
                                className="absolute right-[-30px] bottom-[-30px] w-56 rotate-12 group-hover:rotate-0 transition duration-500 drop-shadow-xl"
                                alt="Camiseta"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>

                        {/* BANNER 2: HOCKEY */}
                        <div className="bg-black text-white rounded-2xl p-8 flex flex-col justify-center items-start relative overflow-hidden min-h-[250px] shadow-lg group">
                            {/* IMAGEN DE FONDO */}
                            <img
                                src="/img/hockey_banner.jpg"
                                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition transform group-hover:scale-105 duration-700"
                                alt="Hockey Taraguy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=2000&auto=format&fit=crop";
                                }}
                            />

                            <div className="relative z-10">
                                <h3 className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-1">Disciplina</h3>
                                <h2 className="text-4xl font-black uppercase mb-4">Hockey</h2>
                                <Link to="/partidos" className="inline-flex items-center gap-2 text-white font-bold hover:text-yellow-400 transition text-sm border-b border-transparent hover:border-yellow-400 pb-1">
                                    Ver Fixture Femenino
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;