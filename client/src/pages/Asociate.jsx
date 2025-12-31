const Asociate = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* MITAD IZQUIERDA: IMAGEN */}
            <div className="md:w-1/2 bg-black relative min-h-[400px]">
                <img
                    src="/img/portada_home.jpg" // Reusamos tu portada o pon otra
                    alt="Hinchada"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-10">
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                        SUMATE AL <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">GIGANTE</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-light">Se parte de la historia. Se parte de la familia.</p>
                </div>
            </div>

            {/* MITAD DERECHA: INFO Y CONTACTO */}
            <div className="md:w-1/2 bg-white flex flex-col justify-center p-12 md:p-20">
                <h2 className="text-3xl font-black uppercase text-gray-900 mb-6">Categorías de Socios</h2>

                <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div>
                            <h3 className="font-bold text-lg">Socio Activo (Jugador)</h3>
                            <p className="text-sm text-gray-500">Incluye seguro médico y gimnasio.</p>
                        </div>
                        <span className="text-xl font-black">$15.000<span className="text-xs font-normal text-gray-400">/mes</span></span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                        <div>
                            <h3 className="font-bold text-lg">Socio Adherente</h3>
                            <p className="text-sm text-gray-500">Acceso al club, pileta y beneficios.</p>
                        </div>
                        <span className="text-xl font-black">$8.000<span className="text-xs font-normal text-gray-400">/mes</span></span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                        <div>
                            <h3 className="font-bold text-lg">Grupo Familiar</h3>
                            <p className="text-sm text-gray-500">Padres + 2 hijos menores de 18.</p>
                        </div>
                        <span className="text-xl font-black">$25.000<span className="text-xs font-normal text-gray-400">/mes</span></span>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <p className="text-gray-600 mb-4 font-medium">Para asociarte, escribinos a WhatsApp con tu Nombre y DNI. Te enviaremos el formulario digital.</p>
                    <a
                        href="https://wa.me/543794445555?text=Hola,%20quiero%20asociarme%20al%20club!"
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full bg-green-600 text-white font-black uppercase py-4 rounded shadow-lg hover:bg-green-700 transition transform hover:-translate-y-1"
                    >
                        Asociarme por WhatsApp 💬
                    </a>
                </div>
            </div>

        </div>
    );
};

export default Asociate;