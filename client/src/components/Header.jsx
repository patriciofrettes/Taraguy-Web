import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="relative w-full h-[400px] md:h-[500px] overflow-hidden shadow-xl">
            {/* 1. LA IMAGEN DEL BANNER */}
            <img
                src="/img/portada_home.jpg"
                alt="Banner Taraguy RC"
                className="w-full h-full object-cover object-center"
                onError={(e) => e.target.src = "https://via.placeholder.com/1500x500?text=BANNER+CLUB"}
            />

            {/* 2. CAPA OSCURA (Degradado para que se lea bien lo de abajo) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* 3. CONTENIDO FLOTANTE (SOLO REDES) */}
            {/* CAMBIO: Usamos justify-end para empujar las redes a la derecha */}
            <div className="absolute inset-0 w-full flex justify-end items-end pb-4 px-4 md:px-8">

                {/* (El Logo que estaba aquí fue eliminado para limpiar la vista) */}

                {/* REDES SOCIALES: Pegadas a la Derecha Abajo */}
                <div className="flex gap-2 mb-2 z-10">
                    {/* INSTAGRAM */}
                    <a href="https://www.instagram.com/taraguyrc" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white hover:text-pink-600 text-white p-2 md:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>

                    {/* FACEBOOK */}
                    <a href="https://www.facebook.com/taraguyrc" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white hover:text-blue-600 text-white p-2 md:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>

                    {/* TWITTER / X */}
                    <a href="https://twitter.com/taraguyrc" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;