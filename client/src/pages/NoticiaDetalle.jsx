import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const NoticiaDetalle = () => {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Scroll arriba al entrar para que no empiece en el medio de la noticia
        window.scrollTo(0, 0);

        axios.get(`${API_URL}/api/Noticias/${id}`)
            .then((response) => {
                setNoticia(response.data);
            })
            .catch((error) => {
                console.error("Error cargando la noticia:", error);
                setError(true);
            });
    }, [id]);

    const getImagen = (ruta) => {
        if (!ruta) return "/img/default_news.jpg";
        if (ruta.startsWith("http")) return ruta;
        return `${API_URL}${ruta}`;
    };

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <p className="text-red-600 font-bold mb-4">Error al cargar la noticia. Verifica tu conexión.</p>
            <Link to="/noticias" className="text-blue-600 underline">Volver al listado</Link>
        </div>
    );

    if (!noticia) return <div className="text-center mt-20 font-bold text-xl uppercase tracking-widest animate-pulse">Cargando noticia...</div>;

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* IMAGEN DE PORTADA */}
            <div className="w-full h-[50vh] md:h-[70vh] overflow-hidden relative bg-black">
                <img
                    src={getImagen(noticia.imagenUrl)}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover opacity-70"
                    onError={(e) => { e.target.src = "/img/default_news.jpg"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-5xl mx-auto">
                        <span className="bg-yellow-500 text-black px-4 py-1 text-xs font-black uppercase tracking-widest mb-4 inline-block">
                            Club Taraguy
                        </span>
                        <h1 className="text-3xl md:text-6xl font-black text-white uppercase leading-none tracking-tighter">
                            {noticia.titulo}
                        </h1>
                    </div>
                </div>
            </div>

            {/* CONTENIDO - Ajustado a los nombres de tu Base de Datos */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-10 border-b pb-6">
                    <span>Publicado por Prensa Taraguy</span>
                    <span className="mx-3 text-gray-300">|</span>
                    {/* Usamos 'fecha' porque así suele venir de C# si no especificaste 'fechaPublicacion' */}
                    <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
                </div>

                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed italic border-l-4 border-black pl-6 mb-10">
                    {/* Tu backend usa 'copete', esto está bien */}
                    {noticia.copete}
                </div>

                <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                    {/* Ajustado: Usualmente en tu backend el campo es 'contenido', no 'cuerpo' */}
                    {noticia.contenido || noticia.cuerpo}
                </div>

                <div className="mt-16 pt-10 border-t flex justify-center">
                    <Link to="/noticias" className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-xl">
                        ← Ver más noticias
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NoticiaDetalle;