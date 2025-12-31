import { useState, useEffect } from 'react';
import axios from 'axios';

const Partidos = () => {
    const [resultados, setResultados] = useState([]);
    const [todosLosPartidos, setTodosLosPartidos] = useState([]); // Guardamos copia original
    const [disciplinaActual, setDisciplinaActual] = useState('Rugby');

    // 1. PRIMERO DEFINIMOS LA FUNCIÓN FILTRAR
    const filtrar = (data, disciplina, categoria) => {
        const hoy = new Date();
        // Filtramos por disciplina
        let filtrados = data.filter(p => p.disciplina === disciplina);

        // Filtramos para que solo muestre partidos TERMINADOS (fechas anteriores a hoy)
        // OJO: Si quieres mostrar próximos, cambia la lógica aquí.
        // Asumo que esta página es de "Resultados" históricos.
        // Si quieres "Próximos partidos", quita el filtro de fecha.

        setResultados(filtrados);
    };

    // 2. DESPUÉS EL USEEFFECT
    useEffect(() => {
        axios.get('https://localhost:7235/api/Partidos')
            .then((response) => {
                setTodosLosPartidos(response.data);
                // Al cargar, filtramos por defecto Rugby
                filtrar(response.data, 'Rugby');
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    const cambiarDisciplina = (nuevaDisciplina) => {
        setDisciplinaActual(nuevaDisciplina);
        filtrar(todosLosPartidos, nuevaDisciplina);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-8 uppercase">Resultados</h1>

                {/* BOTONES FILTRO */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => cambiarDisciplina('Rugby')}
                        className={`px-6 py-2 rounded-full font-black uppercase tracking-widest transition ${disciplinaActual === 'Rugby' ? 'bg-blue-900 text-white' : 'bg-white text-gray-400'}`}
                    >
                        Rugby
                    </button>
                    <button
                        onClick={() => cambiarDisciplina('Hockey')}
                        className={`px-6 py-2 rounded-full font-black uppercase tracking-widest transition ${disciplinaActual === 'Hockey' ? 'bg-pink-700 text-white' : 'bg-white text-gray-400'}`}
                    >
                        Hockey
                    </button>
                </div>

                {/* LISTA DE PARTIDOS */}
                <div className="space-y-4">
                    {resultados.map((partido) => (
                        <div key={partido.id} className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-l-8 border-black">

                            {/* LOCAL */}
                            <div className="flex-1 text-right">
                                <span className="font-black text-xl uppercase block">{partido.esLocal ? 'Taraguy' : partido.rival}</span>
                                {partido.esLocal && <span className="text-xs font-bold text-gray-400">LOCAL</span>}
                            </div>

                            {/* RESULTADO */}
                            <div className="px-6 text-center">
                                <div className="bg-gray-100 px-4 py-2 rounded font-black text-2xl tracking-widest border border-gray-300">
                                    {partido.resultado ? partido.resultado : '- vs -'}
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1 block">
                                    {new Date(partido.fechaHora).toLocaleDateString()}
                                </span>
                            </div>

                            {/* VISITANTE */}
                            <div className="flex-1 text-left flex items-center gap-3">
                                {!partido.esLocal && partido.escudoRivalUrl && (
                                    <img src={`https://localhost:7235${partido.escudoRivalUrl}`} className="w-8 h-8 object-contain" alt="escudo" />
                                )}
                                <div>
                                    <span className="font-black text-xl uppercase block">{partido.esLocal ? partido.rival : 'Taraguy'}</span>
                                    <span className="text-xs font-bold text-blue-600">{partido.torneo}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {resultados.length === 0 && (
                        <p className="text-center text-gray-400 font-bold py-10">No hay partidos registrados para esta disciplina.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Partidos;