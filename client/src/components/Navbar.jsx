import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
// IMPORTANTE: No importamos useCart porque no lo vamos a usar

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Esta función mantiene tu estética original de enlaces (subrayado blanco, hover gris/blanco)
    const linkStyle = (path) => `
        relative group font-black uppercase tracking-wider text-sm md:text-base transition-colors duration-300
        ${location.pathname === path ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}
    `;

    return (
        <nav className="bg-black text-white border-b border-gray-900 sticky top-0 z-50 shadow-2xl">
            <div className="w-full px-6 md:px-10">
                <div className="flex justify-between items-center h-24">

                    {/* --- SECCIÓN IZQUIERDA: LOGO + TEXTO (INTACTO) --- */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/img/logo.png"
                            alt="Taraguy RC"
                            className="h-16 w-auto object-contain transition transform group-hover:scale-105 duration-300"
                        />
                        <div className="hidden md:flex flex-col justify-center">
                            <span className="text-2xl font-black leading-none tracking-tighter italic text-white">
                                TARAGUY <span className="text-gray-400">RC</span>
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase mt-1">
                                Corrientes
                            </span>
                        </div>
                    </Link>

                    {/* --- SECCIÓN CENTRAL: NAVEGACIÓN (SIN TIENDA) --- */}
                    <div className="hidden lg:flex items-center gap-10 xl:gap-14">
                        <Link to="/" className={linkStyle('/')}>Inicio</Link>
                        <Link to="/historia" className={linkStyle('/historia')}>Historia</Link>
                        <Link to="/noticias" className={linkStyle('/noticias')}>Noticias</Link>
                        <Link to="/partidos" className={linkStyle('/partidos')}>Partidos</Link>
                        <Link to="/sponsors" className={linkStyle('/sponsors')}>Sponsors</Link>
                        {/* El enlace a Tienda fue eliminado aquí */}
                    </div>

                    {/* --- SECCIÓN DERECHA: ACCIONES (SIN CARRITO) --- */}
                    <div className="flex items-center gap-6">

                        {/* Botón Asociate (INTACTO) */}
                        <Link
                            to="/asociate"
                            className="hidden xl:block bg-white text-black px-6 py-3 rounded font-black uppercase text-xs tracking-widest hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            ¡Asociate!
                        </Link>

                        {/* El ícono del carrito y la línea divisoria fueron eliminados aquí */}

                        {/* Menú Hamburguesa para Celulares (INTACTO) */}
                        <div className="flex lg:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MENÚ DESPLEGABLE MÓVIL (SIN TIENDA) --- */}
            <div className={`lg:hidden bg-zinc-900 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-white font-bold uppercase tracking-widest">Inicio</Link>
                    <Link to="/partidos" onClick={() => setIsOpen(false)} className="text-white font-bold uppercase tracking-widest">Partidos</Link>
                    <Link to="/sponsors" onClick={() => setIsOpen(false)} className="text-white font-bold uppercase tracking-widest">Sponsors</Link>
                    <Link to="/noticias" onClick={() => setIsOpen(false)} className="text-white font-bold uppercase tracking-widest">Noticias</Link>
                    <Link to="/asociate" onClick={() => setIsOpen(false)} className="bg-white text-black px-8 py-3 rounded font-black uppercase text-xs w-full text-center mt-4">¡Asociate!</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;