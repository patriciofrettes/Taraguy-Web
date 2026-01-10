import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// URL BASE (Sin duplicar https)
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const NoticiaDetalle = () => {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);

    useEffect(() => {
        // CORRECCIÓN: Usamos la constante API_URL para evitar errores de tipeo
        axios.get(`${API_URL}/api/Noticias/${id}`)
            .then((response) => {
                setNoticia(response.data);
            })
            .catch((error) => {
                console.error("Error cargando la noticia:", error);
            });
    }, [id]);

    // 🔧 FUNCIÓN CORREGIDA Y ACTUALIZADA
    const obtenerImagen = (ruta) => {
        if (!ruta) return "/img/default_news.png"; // Imagen local por defecto si es null

        // Si ya es un link completo de internet
        if (ruta.startsWith("http")) return ruta;

        // Si viene del servidor (ya sea carpeta vieja /uploads o nueva /img)
        if (ruta.startsWith("/uploads") || ruta.startsWith("/img")) {
            return `${API_URL}${ruta}`;
        }

        return ruta;
    };

    if (!noticia) return <div className="text-center mt-20 font-bold text-xl">Cargando noticia...</div>;

    return (
        <div className="min-h-screen bg-white pb-20">

            {/* 1. IMAGEN GIGANTE DE PORTADA */}
            <div className="w-full h-96 overflow-hidden relative bg-black">
                <img
                    src={obtenerImagen(noticia.imagenUrl)}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => { e.target.style.display = 'none'; }} // Si falla, ocultamos para que no se vea roto
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-10">
                    <div className="max-w-7xl mx-auto">
                        <span className="bg-red-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
                            Novedades
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mt-4 uppercase leading-none">
                            {noticia.titulo}
                        </h1>
                    </div>
                </div>
            </div>

            {/* 2. CONTENIDO COMPLETO */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center text-gray-500 text-sm font-bold uppercase tracking-widest mb-8 border-b pb-4">
                    {/* Quitamos 'autor' porque la BD no lo tiene, ponemos Admin fijo */}
                    <span>Por Admin</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(noticia.fechaPublicacion).toLocaleDateString()}</span>
                </div>

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    <p className="font-bold text-xl mb-6 text-black">
                        {noticia.copete}
                    </p>
                    <p className="whitespace-pre-line">
                        {noticia.cuerpo ? noticia.cuerpo : "No hay más detalles para esta noticia."}
                    </p>
                </div>

                <div className="mt-12 pt-10 border-t">
                    <Link to="/noticias" className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        ← Volver a Noticias
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NoticiaDetalle;