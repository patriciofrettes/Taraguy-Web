const Beneficios = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">

            {/* HERO */}
            <div className="bg-black text-white py-24 px-4 text-center">
                <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm">Comunidad Taraguy</span>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mt-2 mb-6">Beneficios del Socio</h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">
                    Ser socio es mucho más que ir a la cancha. Disfrutá de instalaciones exclusivas y descuentos en comercios adheridos.
                </p>
            </div>

            {/* INSTALACIONES */}
            <div className="max-w-7xl mx-auto px-4 -mt-16 grid md:grid-cols-3 gap-8 mb-20">
                {/* CARD 1 */}
                <div className="bg-white p-8 rounded-xl shadow-xl hover:-translate-y-2 transition duration-300">
                    <div className="text-5xl mb-4">🏋️‍♂️</div>
                    <h3 className="text-2xl font-black uppercase mb-3">Gimnasio Full</h3>
                    <p className="text-gray-600">Acceso libre al gimnasio de alto rendimiento del club, con preparadores físicos a disposición en horarios extendidos.</p>
                </div>
                {/* CARD 2 */}
                <div className="bg-white p-8 rounded-xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-4 border-yellow-400 relative z-10">
                    <div className="text-5xl mb-4">🏊‍♂️</div>
                    <h3 className="text-2xl font-black uppercase mb-3">Pileta & Quincho</h3>
                    <p className="text-gray-600">Disfrutá del verano en nuestra pileta olímpica y reservá los quinchos para tus eventos y tercer tiempo con amigos.</p>
                </div>
                {/* CARD 3 */}
                <div className="bg-white p-8 rounded-xl shadow-xl hover:-translate-y-2 transition duration-300">
                    <div className="text-5xl mb-4">🎟️</div>
                    <h3 className="text-2xl font-black uppercase mb-3">Entradas Free</h3>
                    <p className="text-gray-600">Ingreso gratuito a todos los partidos de local del Plantel Superior y descuentos exclusivos en entradas para finales.</p>
                </div>
            </div>

            {/* LISTA DE COMERCIOS */}
            <div className="max-w-4xl mx-auto px-4 pb-20">
                <h2 className="text-3xl font-black text-center uppercase mb-10">Comercios Adheridos</h2>
                <div className="space-y-4">
                    {[
                        { nombre: "Sport Center", desc: "20% de descuento en indumentaria deportiva.", rubro: "Deportes" },
                        { nombre: "Parrilla El Correntino", desc: "15% off presentando tu carnet de socio.", rubro: "Gastronomía" },
                        { nombre: "Farmacia Central", desc: "10% de descuento en perfumería.", rubro: "Salud" },
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg border-l-4 border-black shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg">{item.nombre}</h4>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                            <span className="text-xs font-bold uppercase bg-gray-100 px-3 py-1 rounded text-gray-500">{item.rubro}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Beneficios;