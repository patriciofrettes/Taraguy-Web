const Historia = () => {
    return (
        <div className="bg-white font-sans text-gray-900">

            {/* 1. PORTADA HERO (Imagen Grande) */}
            <div className="relative h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                {/* Imagen de fondo oscurecida */}
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <img
                    src="/img/historia_hero.jpg"
                    alt="Historia del Club"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=2070&auto=format&fit=crop"}
                />

                <div className="relative z-20 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
                        Nuestra Historia
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light">
                        Más que un club, una familia. Pasión, respeto y disciplina desde el primer día.
                    </p>
                </div>
            </div>

            {/* 2. SECCIÓN: LOS INICIOS */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Los Inicios</h2>
                        <h3 className="text-4xl font-black mb-6">Un sueño que nació en Corrientes</h3>
                        <p className="text-gray-600 leading-relaxed text-lg mb-4">
                            Todo comenzó con un grupo de amigos apasionados por el deporte. En aquellos años, no teníamos cancha propia ni camisetas oficiales, pero nos sobraban las ganas de jugar.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Fundado oficialmente el <strong>[AÑO DE FUNDACIÓN]</strong>, Taraguy Rugby Club se estableció con la misión de formar no solo grandes jugadores, sino excelentes personas.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="/img/historia_inicios.jpg"
                            alt="Fundadores"
                            className="rounded-lg shadow-2xl rotate-2 hover:rotate-0 transition duration-500 transform"
                            onError={(e) => e.target.src = "https://images.unsplash.com/photo-1628779238951-be2c9f255915?auto=format&fit=crop&q=80&w=800"}
                        />
                    </div>
                </div>
            </div>

            {/* 3. SECCIÓN: VALORES (Fondo gris) */}
            <div className="bg-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black uppercase mb-4">Nuestros Valores</h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Tarjeta 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-black hover:-translate-y-2 transition duration-300">
                            <div className="text-4xl mb-4">🤝</div>
                            <h4 className="text-xl font-bold uppercase mb-3">Respeto</h4>
                            <p className="text-gray-600">Al árbitro, al rival y a los compañeros. Sin respeto no hay rugby.</p>
                        </div>
                        {/* Tarjeta 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-600 hover:-translate-y-2 transition duration-300">
                            <div className="text-4xl mb-4">💪</div>
                            <h4 className="text-xl font-bold uppercase mb-3">Disciplina</h4>
                            <p className="text-gray-600">El esfuerzo constante y el compromiso con el entrenamiento son innegociables.</p>
                        </div>
                        {/* Tarjeta 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-black hover:-translate-y-2 transition duration-300">
                            <div className="text-4xl mb-4">❤️</div>
                            <h4 className="text-xl font-bold uppercase mb-3">Pasión</h4>
                            <p className="text-gray-600">Jugamos cada pelota como si fuera la última. Sentimos la camiseta.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. SECCIÓN: EL PRESENTE */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Actualidad</h2>
                        <h3 className="text-4xl font-black mb-6">Creciendo día a día</h3>
                        <p className="text-gray-600 leading-relaxed text-lg mb-4">
                            Hoy contamos con instalaciones de primer nivel, cancha de Hockey sintético, gimnasio y quincho para el tercer tiempo.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Nuestras divisiones infantiles, juveniles y plantel superior compiten al máximo nivel regional, llevando los colores del club a lo más alto.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="/img/historia_actualidad.jpg"
                            alt="Club Actual"
                            className="rounded-lg shadow-2xl -rotate-2 hover:rotate-0 transition duration-500 transform"
                            onError={(e) => e.target.src = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800"}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Historia;