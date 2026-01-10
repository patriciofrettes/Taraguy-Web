import { useState, useEffect } from 'react';
import axios from 'axios';

// URL BASE
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/api/Sponsors`)
            .then(res => {
                setSponsors(res.data);
                setCargando(false);
            })
            .catch(e => {
                console.error(e);
                setCargando(false);
            });
    }, []);

    // 🔧 FUNCIÓN PARA ARREGLAR URL DE IMÁGENES
    const getLogo = (ruta) => {
        if (!ruta) return null;
        if (ruta.startsWith("http")) return ruta;
        return `${API_URL}${ruta}`;
    };

    return (
        <div className="bg-white min-h-screen pb-20">

            {/* HERO */}
            <div className="bg-black text-white py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Nuestros Sponsors</h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Empresas que comparten nuestros valores y hacen posible que el gigante siga creciendo.
                </p>
            </div>

            {/* LISTA DE SPONSORS */}
            <div className="max-w-7xl mx-auto px-4 mt-16">

                {cargando ? (
                    <div className="text-center py-20 font-bold">Cargando sponsors...</div>
                ) : sponsors.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center">
                        {sponsors.map((s) => (
                            <a
                                key={s.id}
                                href={s.linkWeb || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center justify-center p-6 border border-gray-100 rounded-xl hover:shadow-xl transition duration-300 bg-white h-48"
                            >
                                <img
                                    src={getLogo(s.logoUrl)}
                                    className="max-h-24 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition duration-500 opacity-70 group-hover:opacity-100 group-hover:scale-110"
                                    alt={s.nombre}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                {/* Si querés mostrar el nombre abajo, descomentá esto: */}
                                {/* <span className="mt-4 font-bold text-xs uppercase text-gray-300 group-hover:text-black">{s.nombre}</span> */}
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No hay sponsors cargados actualmente.</p>
                )}

            </div>

            {/* CALL TO ACTION */}
            <div className="mt-20 bg-gray-900 text-white py-12 text-center mx-4 rounded-xl">
                <h3 className="text-2xl font-bold uppercase mb-4">¿Querés ser parte del gigante?</h3>
                <button className="bg-white text-black px-8 py-3 font-black uppercase rounded hover:bg-yellow-400 transition">
                    Contactar Marketing
                </button>
            </div>
        </div>
    );
};

export default Sponsors;