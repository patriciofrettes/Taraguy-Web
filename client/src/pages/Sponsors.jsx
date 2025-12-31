const Sponsors = () => {
    // Array de ejemplo. Luego puedes poner las imágenes reales en /public/img/sponsors/
    const sponsors = [1, 2, 3, 4, 5, 6, 7, 8]; 
  
    return (
      <div className="bg-white min-h-screen pb-20">
        
        {/* HERO */}
        <div className="bg-black text-white py-20 text-center">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Nuestros Sponsors</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Empresas que comparten nuestros valores y hacen posible que el gigante siga creciendo.
            </p>
        </div>
  
        {/* MAIN SPONSORS (Más grandes) */}
        <div className="max-w-7xl mx-auto px-4 mt-16 text-center">
            <h2 className="text-yellow-400 font-bold uppercase tracking-[0.3em] mb-8">Main Sponsors</h2>
            <div className="flex flex-wrap justify-center gap-12 items-center">
                {/* Logos Grandes */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png" className="h-24 grayscale hover:grayscale-0 transition duration-500 opacity-70 hover:opacity-100" alt="Adidas" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/2560px-Sony_logo.svg.png" className="h-16 grayscale hover:grayscale-0 transition duration-500 opacity-70 hover:opacity-100" alt="Sony" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png" className="h-16 grayscale hover:grayscale-0 transition duration-500 opacity-70 hover:opacity-100" alt="H&M" />
            </div>
        </div>
  
        <div className="w-full h-px bg-gray-200 my-16 max-w-4xl mx-auto"></div>
  
        {/* PARTNERS (Grilla general) */}
        <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-center text-gray-400 font-bold uppercase tracking-widest mb-10 text-sm">Official Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {sponsors.map((s) => (
                    <div key={s} className="bg-gray-50 h-32 flex items-center justify-center rounded-lg border border-gray-100 hover:shadow-md transition">
                        <span className="text-gray-300 font-black text-2xl uppercase">LOGO {s}</span>
                    </div>
                ))}
            </div>
        </div>
  
        {/* CALL TO ACTION */}
        <div className="mt-20 bg-gray-900 text-white py-12 text-center">
            <h3 className="text-2xl font-bold uppercase mb-4">¿Querés ser parte del gigante?</h3>
            <button className="bg-white text-black px-8 py-3 font-black uppercase rounded hover:bg-yellow-400 transition">
                Contactar Marketing
            </button>
        </div>
      </div>
    );
  };
  
  export default Sponsors;