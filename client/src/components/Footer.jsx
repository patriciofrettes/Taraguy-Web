import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                {/* COLUMNA 1: INFO */}
                <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">
                        {/* CAMBIO AQUÍ: RC ahora es GRIS (text-gray-500), no rojo */}
                        TARAGUY <span className="text-gray-500">RC</span>
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                        Club de Rugby y Hockey. Formando personas, cultivando pasiones desde Corrientes para el mundo.
                    </p>
                    <div className="flex gap-4">
                        {/* ICONOS NEUTROS: Ahora se iluminan blanco al pasar el mouse, sin colores ajenos */}
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                    </div>
                </div>

                {/* COLUMNA 2: ENLACES RÁPIDOS */}
                <div>
                    <h4 className="text-sm font-black uppercase mb-6 text-white tracking-widest">Navegación</h4>
                    <ul className="space-y-3 text-gray-400 text-sm font-medium">
                        <li><Link to="/" className="hover:text-white transition hover:translate-x-1 inline-block">Inicio</Link></li>
                        <li><Link to="/historia" className="hover:text-white transition hover:translate-x-1 inline-block">Historia del Club</Link></li>
                        <li><Link to="/noticias" className="hover:text-white transition hover:translate-x-1 inline-block">Noticias</Link></li>
                        <li><Link to="/partidos" className="hover:text-white transition hover:translate-x-1 inline-block">Fixture y Resultados</Link></li>
                        <li><Link to="/tienda" className="hover:text-yellow-400 transition hover:translate-x-1 inline-block font-bold">Tienda Oficial</Link></li>
                    </ul>
                </div>

                {/* COLUMNA 3: CONTACTO */}
                <div>
                    <h4 className="text-sm font-black uppercase mb-6 text-white tracking-widest">Contacto</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li className="flex items-start gap-3">
                            <span className="text-lg">📍</span>
                            <span>Ruta Nacional 12, Km 1030,<br />Corrientes, Argentina.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-lg">📧</span>
                            <span>contacto@taraguyrc.com.ar</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-lg">📞</span>
                            <span>+54 379 444-5555</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* COPYRIGHT */}
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs">
                <p>&copy; {new Date().getFullYear()} Taraguy Rugby Club.</p>
                <p className="mt-2 md:mt-0 flex items-center gap-1">Desarrollado con pasión <span className="text-white">🦅</span></p>
            </div>
        </footer>
    );
};

export default Footer;