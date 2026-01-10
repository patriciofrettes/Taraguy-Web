import { useState, useEffect } from 'react';
import axios from 'axios';

// URL BASE
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Partidos = () => {
    const [todosLosPartidos, setTodosLosPartidos] = useState([]);
    const [partidosFiltrados, setPartidosFiltrados] = useState([]);
    const [disciplina, setDisciplina] = useState('Rugby');
    const [categoria, setCategoria] = useState('Primera');
    const [mesActual, setMesActual] = useState(new Date());

    useEffect(() => {
        axios.get(`${API_URL}/api/Partidos`)
            .then(res => setTodosLosPartidos(res.data))
            .catch(e => console.error(e));
    }, []);

    useEffect(() => {
        const filtrados = todosLosPartidos.filter(p => p.disciplina === disciplina && p.categoria === categoria);
        setPartidosFiltrados(filtrados);
    }, [todosLosPartidos, disciplina, categoria]);

    // 🔧 LÓGICA DE IMAGEN (Igual que Tienda)
    const getEscudo = (ruta) => {
        if (!ruta) return null;
        if (ruta.startsWith("http")) return ruta;
        return `${API_URL}${ruta}`;
    };

    // CALENDARIO
    const getDiasEnMes = (fecha) => {
        const year = fecha.getFullYear();
        const month = fecha.getMonth();
        const dias = new Date(year, month + 1, 0).getDate();
        const primerDiaSemana = new Date(year, month, 1).getDay();
        return { dias, primerDiaSemana };
    };
    const { dias, primerDiaSemana } = getDiasEnMes(mesActual);
    const diasArray = Array.from({ length: dias }, (_, i) => i + 1);
    const espaciosVacios = Array.from({ length: primerDiaSemana }, (_, i) => i);

    const cambiarMes = (offset) => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + offset, 1));

    const getPartidosDelDia = (dia) => partidosFiltrados.filter(p => {
        const d = new Date(p.fechaHora);
        return d.getDate() === dia && d.getMonth() === mesActual.getMonth() && d.getFullYear() === mesActual.getFullYear();
    });

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-8 uppercase tracking-tighter">Fixture y Resultados</h1>

                {/* FILTROS */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row gap-6 justify-center items-center">
                    <div className="flex bg-gray-100 rounded-full p-1">
                        <button onClick={() => setDisciplina('Rugby')} className={`px-6 py-2 rounded-full font-black uppercase transition ${disciplina === 'Rugby' ? 'bg-black text-white shadow' : 'text-gray-500'}`}>Rugby 🏉</button>
                        <button onClick={() => setDisciplina('Hockey')} className={`px-6 py-2 rounded-full font-black uppercase transition ${disciplina === 'Hockey' ? 'bg-pink-600 text-white shadow' : 'text-gray-500'}`}>Hockey 🏑</button>
                    </div>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="bg-gray-100 border-none font-bold uppercase rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-200 transition focus:ring-2 focus:ring-black">
                        {disciplina === 'Rugby' ? (
                            <><option>Primera</option><option>Intermedia</option><option>Pre-Intermedia</option><option>M-19</option><option>M-17</option><option>M-16</option><option>M-15</option></>
                        ) : (
                            <><option>Plantel Superior (F)</option><option>Sub-18 (F)</option><option>Sub-16 (F)</option></>
                        )}
                    </select>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* CALENDARIO */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={() => cambiarMes(-1)} className="font-bold text-2xl hover:bg-gray-100 w-10 h-10 rounded-full">&lt;</button>
                            <h2 className="text-2xl font-black uppercase">{mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</h2>
                            <button onClick={() => cambiarMes(1)} className="font-bold text-2xl hover:bg-gray-100 w-10 h-10 rounded-full">&gt;</button>
                        </div>
                        <div className="grid grid-cols-7 text-center font-bold text-gray-400 text-xs uppercase mb-2"><div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div></div>

                        <div className="grid grid-cols-7 gap-2">
                            {espaciosVacios.map(i => <div key={`empty-${i}`}></div>)}

                            {diasArray.map(dia => {
                                const partidosDia = getPartidosDelDia(dia);
                                const hayPartido = partidosDia.length > 0;
                                const esHoy = new Date().getDate() === dia && new Date().getMonth() === mesActual.getMonth();

                                return (
                                    <div key={dia} className={`h-28 border rounded-lg p-1 flex flex-col justify-between transition hover:border-black ${esHoy ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-100'} ${hayPartido ? 'ring-2 ring-black bg-white' : ''}`}>
                                        <span className={`font-bold text-sm ml-1 ${esHoy ? 'text-yellow-600' : 'text-gray-400'}`}>{dia}</span>

                                        <div className="flex flex-col gap-1 items-center justify-center flex-grow">
                                            {partidosDia.map(p => {
                                                const escudo = getEscudo(p.escudoRivalUrl);
                                                return (
                                                    <div key={p.id} className="flex flex-col items-center group w-full" title={`vs ${p.rival}`}>

                                                        {/* IMAGEN DEL ESCUDO EN EL CALENDARIO 👇 */}
                                                        {escudo ? (
                                                            <img
                                                                src={escudo}
                                                                alt={p.rival}
                                                                className="w-10 h-10 object-contain drop-shadow-sm transform group-hover:scale-110 transition"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}

                                                        {/* Fallback si no hay foto */}
                                                        <div
                                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-[10px] text-gray-500"
                                                            style={{ display: escudo ? 'none' : 'flex' }}
                                                        >
                                                            VS
                                                        </div>

                                                        {/* Nombre pequeñito abajo */}
                                                        <span className="text-[9px] font-black uppercase mt-1 truncate max-w-full text-center leading-none">
                                                            {p.rival}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* LISTA DE PARTIDOS (Derecha) */}
                    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        <h3 className="font-black uppercase text-xl mb-4 border-b pb-2">Partidos del Mes</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {partidosFiltrados.filter(p => new Date(p.fechaHora).getMonth() === mesActual.getMonth())
                                .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
                                .map(p => {
                                    const yaJugo = p.resultado && p.resultado !== "";
                                    const escudoUrl = getEscudo(p.escudoRivalUrl);

                                    return (
                                        <div key={p.id} className="border-l-4 border-black pl-4 py-2 hover:bg-gray-50 transition rounded-r">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">{new Date(p.fechaHora).toLocaleDateString()} • {new Date(p.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

                                            <div className="flex items-center gap-3 mb-2">
                                                <img src="/img/logo.png" className="w-8 h-8 object-contain" alt="Taraguy" />
                                                <span className="font-bold text-sm">VS</span>

                                                {/* Escudo Lista */}
                                                {escudoUrl ? (
                                                    <img
                                                        src={escudoUrl}
                                                        className="w-8 h-8 object-contain"
                                                        alt={p.rival}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs"
                                                    style={{ display: escudoUrl ? 'none' : 'flex' }}
                                                >
                                                    ?
                                                </div>
                                            </div>

                                            <h4 className="font-black uppercase text-lg leading-none mb-1">{p.rival}</h4>
                                            <p className="text-xs uppercase text-gray-500 mb-2">{p.lugar}</p>
                                            {yaJugo ? <div className="bg-gray-100 text-center py-2 rounded font-mono font-black text-xl tracking-widest border border-gray-300">{p.resultado}</div> : <div className="bg-yellow-400 text-center py-1 rounded text-xs font-bold uppercase text-black">Próximamente</div>}
                                        </div>
                                    )
                                })}
                            {partidosFiltrados.filter(p => new Date(p.fechaHora).getMonth() === mesActual.getMonth()).length === 0 && <p className="text-center text-gray-400 text-sm">No hay partidos.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partidos;