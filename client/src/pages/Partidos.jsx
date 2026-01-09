import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Partidos = () => {
    const [todosLosPartidos, setTodosLosPartidos] = useState([]);
    const [partidosFiltrados, setPartidosFiltrados] = useState([]);

    // Filtros
    const [disciplina, setDisciplina] = useState('Rugby');
    const [categoria, setCategoria] = useState('Primera');
    const [mesActual, setMesActual] = useState(new Date()); // Para navegar el calendario

    useEffect(() => {
        axios.get(`${API_URL}/api/Partidos`)
            .then(res => setTodosLosPartidos(res.data))
            .catch(e => console.error(e));
    }, []);

    // Cada vez que cambian los filtros o los datos, actualizamos la lista
    useEffect(() => {
        const filtrados = todosLosPartidos.filter(p =>
            p.disciplina === disciplina &&
            p.categoria === categoria
        );
        setPartidosFiltrados(filtrados);
    }, [todosLosPartidos, disciplina, categoria]);

    // --- LÓGICA DEL CALENDARIO ---
    const getDiasEnMes = (fecha) => {
        const year = fecha.getFullYear();
        const month = fecha.getMonth();
        const dias = new Date(year, month + 1, 0).getDate();
        const primerDiaSemana = new Date(year, month, 1).getDay(); // 0 = Domingo
        return { dias, primerDiaSemana };
    };

    const { dias, primerDiaSemana } = getDiasEnMes(mesActual);
    const diasArray = Array.from({ length: dias }, (_, i) => i + 1);
    const espaciosVacios = Array.from({ length: primerDiaSemana }, (_, i) => i);

    const cambiarMes = (offset) => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + offset, 1));
    };

    // Función para ver si hay partido un día específico
    const getPartidosDelDia = (dia) => {
        return partidosFiltrados.filter(p => {
            const fechaP = new Date(p.fechaHora);
            return fechaP.getDate() === dia &&
                fechaP.getMonth() === mesActual.getMonth() &&
                fechaP.getFullYear() === mesActual.getFullYear();
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-8 uppercase tracking-tighter">Fixture y Resultados</h1>

                {/* 1. FILTROS PRINCIPALES */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row gap-6 justify-center items-center">

                    {/* Switch Deporte */}
                    <div className="flex bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setDisciplina('Rugby')}
                            className={`px-6 py-2 rounded-full font-black uppercase transition ${disciplina === 'Rugby' ? 'bg-black text-white shadow' : 'text-gray-500'}`}
                        >
                            Rugby 🏉
                        </button>
                        <button
                            onClick={() => setDisciplina('Hockey')}
                            className={`px-6 py-2 rounded-full font-black uppercase transition ${disciplina === 'Hockey' ? 'bg-pink-600 text-white shadow' : 'text-gray-500'}`}
                        >
                            Hockey 🏑
                        </button>
                    </div>

                    {/* Dropdown Categoría */}
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="bg-gray-100 border-none font-bold uppercase rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-200 transition focus:ring-2 focus:ring-black"
                    >
                        {disciplina === 'Rugby' ? (
                            <>
                                <option>Primera</option><option>Intermedia</option><option>Pre-Intermedia</option>
                                <option>M-19</option><option>M-17</option><option>M-16</option><option>M-15</option>
                            </>
                        ) : (
                            <>
                                <option>Plantel Superior (F)</option><option>Sub-18 (F)</option><option>Sub-16 (F)</option>
                            </>
                        )}
                    </select>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* 2. EL CALENDARIO (Izquierda) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={() => cambiarMes(-1)} className="font-bold text-2xl hover:bg-gray-100 w-10 h-10 rounded-full">&lt;</button>
                            <h2 className="text-2xl font-black uppercase">
                                {mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button onClick={() => cambiarMes(1)} className="font-bold text-2xl hover:bg-gray-100 w-10 h-10 rounded-full">&gt;</button>
                        </div>

                        {/* Grilla Semanal */}
                        <div className="grid grid-cols-7 text-center font-bold text-gray-400 text-xs uppercase mb-2">
                            <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
                        </div>

                        {/* Grilla Días */}
                        <div className="grid grid-cols-7 gap-2">
                            {espaciosVacios.map(i => <div key={`empty-${i}`}></div>)}

                            {diasArray.map(dia => {
                                const partidosDia = getPartidosDelDia(dia);
                                const hayPartido = partidosDia.length > 0;
                                const esHoy = new Date().getDate() === dia && new Date().getMonth() === mesActual.getMonth();

                                return (
                                    <div key={dia} className={`
                                        h-24 border rounded-lg p-2 flex flex-col justify-between transition hover:border-black
                                        ${esHoy ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-100'}
                                        ${hayPartido ? 'ring-2 ring-black bg-white' : ''}
                                    `}>
                                        <span className={`font-bold ${esHoy ? 'text-yellow-600' : 'text-gray-400'}`}>{dia}</span>

                                        {/* Puntito indicador o mini escudo */}
                                        <div className="flex flex-col gap-1 overflow-hidden">
                                            {partidosDia.map(p => (
                                                <div key={p.id} className="text-[10px] bg-black text-white px-1 rounded truncate font-bold" title={p.rival}>
                                                    vs {p.rival}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. LISTA DE DETALLES (Derecha - Próximos y Resultados del Mes) */}
                    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        <h3 className="font-black uppercase text-xl mb-4 border-b pb-2">Partidos del Mes</h3>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {partidosFiltrados
                                .filter(p => new Date(p.fechaHora).getMonth() === mesActual.getMonth())
                                .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
                                .map(p => {
                                    const yaJugo = p.resultado !== null && p.resultado !== "";

                                    return (
                                        <div key={p.id} className="border-l-4 border-black pl-4 py-2">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">
                                                {new Date(p.fechaHora).toLocaleDateString()} • {new Date(p.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            <div className="flex items-center gap-3 mb-2">
                                                <img src="/img/logo.png" className="w-8 h-8 object-contain" />
                                                <span className="font-bold text-sm">VS</span>
                                                {p.escudoRivalUrl ? (
                                                    <img src={p.escudoRivalUrl} className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs">?</div>
                                                )}
                                            </div>

                                            <h4 className="font-black uppercase text-lg leading-none mb-1">{p.rival}</h4>
                                            <p className="text-xs uppercase text-gray-500 mb-2">{p.lugar}</p>

                                            {yaJugo ? (
                                                <div className="bg-gray-100 text-center py-2 rounded font-mono font-black text-xl tracking-widest border border-gray-300">
                                                    {p.resultado}
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-400 text-center py-1 rounded text-xs font-bold uppercase text-black">
                                                    Próximamente
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                            {partidosFiltrados.filter(p => new Date(p.fechaHora).getMonth() === mesActual.getMonth()).length === 0 && (
                                <p className="text-center text-gray-400 text-sm">No hay partidos en este mes para {disciplina} {categoria}.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Partidos;