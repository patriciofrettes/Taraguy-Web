import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// URL BASE
const API_URL = "https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net";

const Admin = () => {
    const [tabActiva, setTabActiva] = useState('tienda');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight">Panel de Control</h1>
                    <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
                        Cerrar Sesión
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-4 mb-8 border-b border-gray-300 pb-4">
                    {['tienda', 'noticias', 'partidos', 'ventas'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setTabActiva(tab)}
                            className={`px-4 py-2 rounded font-bold uppercase text-sm transition ${tabActiva === tab ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-200'}`}
                        >
                            {tab === 'tienda' ? '👕 Tienda' : tab === 'noticias' ? '📰 Noticias' : tab === 'partidos' ? '🏆 Partidos' : '💰 Ventas'}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    {tabActiva === 'tienda' && <PanelTienda />}
                    {tabActiva === 'noticias' && <PanelNoticias />}
                    {tabActiva === 'partidos' && <PanelPartidos />}
                    {tabActiva === 'ventas' && <PanelVentas />}
                </div>
            </div>
        </div>
    );
};

/* --- 1. TIENDA --- */
const PanelTienda = () => {
    const [productos, setProductos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState({
        nombre: '', descripcion: '', precio: '', stock: '',
        categoriaProducto: 'Indumentaria', talles: '', visible: true, imagen: null
    });

    // CORRECCIÓN: Definimos la función ANTES del useEffect
    const cargar = async () => {
        try { const res = await axios.get(`${API_URL}/api/Productos`); setProductos(res.data); }
        catch (e) { console.error(e); }
    };

    useEffect(() => { cargar(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value) });
    };

    const iniciarEdicion = (prod) => {
        setEditandoId(prod.id);
        setForm({
            nombre: prod.nombre, descripcion: prod.descripcion || '', precio: prod.precio,
            stock: prod.stock, categoriaProducto: prod.categoriaProducto, talles: prod.talles || '',
            visible: prod.activo, imagen: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoriaProducto: 'Indumentaria', talles: '', visible: true, imagen: null });
        const fileInput = document.getElementById('fileInputProd');
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key] !== null) formData.append(key, form[key]);
        });
        if (editandoId) formData.append('id', editandoId);

        try {
            if (editandoId) await axios.put(`${API_URL}/api/Productos/${editandoId}`, form);
            else await axios.post(`${API_URL}/api/Productos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            alert(editandoId ? 'Producto actualizado' : 'Producto creado');
            cargar(); cancelarEdicion();
        } catch (error) { alert("Error al guardar producto."); console.error(error); }
    };

    const borrar = async (id) => {
        if (confirm("¿Borrar producto?")) {
            await axios.delete(`${API_URL}/api/Productos/${id}`);
            cargar();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-black uppercase mb-6">{editandoId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                <input required name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border p-2 rounded" />
                <select name="categoriaProducto" value={form.categoriaProducto} onChange={handleChange} className="border p-2 rounded">
                    <option>Indumentaria</option><option>Accesorios</option><option>Tercer Tiempo</option>
                </select>
                <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="col-span-2 border p-2 rounded h-20" />
                {form.categoriaProducto === 'Indumentaria' && <input name="talles" placeholder="Talles (S, M, L)" value={form.talles} onChange={handleChange} className="col-span-2 border p-2 rounded" />}
                <input type="number" placeholder="Precio" required name="precio" value={form.precio} onChange={handleChange} className="border p-2 rounded" />
                <input type="number" placeholder="Stock" required name="stock" value={form.stock} onChange={handleChange} className="border p-2 rounded" />
                <div className="col-span-2">
                    <label className="block text-sm font-bold mb-1">Imagen</label>
                    <input id="fileInputProd" type="file" name="imagen" onChange={handleChange} className="w-full" />
                </div>
                <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-black text-white py-3 rounded font-bold uppercase hover:bg-gray-800">{editandoId ? 'Guardar Cambios' : 'Publicar'}</button>
                    {editandoId && <button type="button" onClick={cancelarEdicion} className="bg-gray-500 text-white px-4 rounded font-bold">Cancelar</button>}
                </div>
            </form>

            <h3 className="font-black uppercase text-lg mb-4">Inventario</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 uppercase font-bold text-gray-600">
                        <tr><th className="p-3">Foto</th><th className="p-3">Nombre</th><th className="p-3">Precio</th><th className="p-3 text-right">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y">
                        {productos.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-3"><img src={p.imagenUrl ? `${API_URL}${p.imagenUrl}` : '/img/default.png'} className="w-10 h-10 object-cover rounded" /></td>
                                <td className="p-3 font-bold">{p.nombre}</td>
                                <td className="p-3 text-green-600">${p.precio}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => iniciarEdicion(p)} className="text-blue-600 font-bold mr-3">EDITAR</button>
                                    <button onClick={() => borrar(p.id)} className="text-red-600 font-bold">BORRAR</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* --- 2. NOTICIAS --- */
const PanelNoticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [form, setForm] = useState({ titulo: '', copete: '', cuerpo: '', imagen: null });

    // CORRECCIÓN: Función antes del useEffect
    const cargar = async () => {
        try { const res = await axios.get(`${API_URL}/api/Noticias`); setNoticias(res.data); }
        catch (e) { console.error(e); }
    };

    useEffect(() => { cargar(); }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titulo', form.titulo);
        formData.append('copete', form.copete);
        formData.append('cuerpo', form.cuerpo);
        // Quitamos 'autor' porque tu backend dio error con eso
        if (form.imagen) formData.append('imagen', form.imagen);

        try {
            await axios.post(`${API_URL}/api/Noticias`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Noticia publicada');
            setForm({ titulo: '', copete: '', cuerpo: '', imagen: null });
            document.getElementById('fileInputNews').value = "";
            cargar();
        } catch (error) { alert("Error al guardar noticia."); console.error(error); }
    };

    const borrar = async (id) => {
        if (confirm("¿Borrar noticia?")) {
            await axios.delete(`${API_URL}/api/Noticias/${id}`);
            cargar();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-black uppercase mb-6">➕ Nueva Noticia</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-10 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                <input required name="titulo" placeholder="Título de la noticia" value={form.titulo} onChange={handleChange} className="border p-3 rounded font-bold" />
                <textarea name="copete" placeholder="Copete (Resumen corto)" value={form.copete} onChange={handleChange} className="border p-3 rounded h-20" />
                <textarea required name="cuerpo" placeholder="Cuerpo de la noticia (Texto completo)" value={form.cuerpo} onChange={handleChange} className="border p-3 rounded h-40" />
                <div>
                    <label className="block text-sm font-bold mb-1">Imagen de Portada</label>
                    <input id="fileInputNews" type="file" name="imagen" onChange={handleChange} className="w-full bg-white p-2 border rounded" />
                </div>
                <button type="submit" className="bg-black text-white py-3 rounded font-bold uppercase hover:bg-gray-800">Publicar Noticia</button>
            </form>

            <h3 className="font-black uppercase text-lg mb-4">Últimas Noticias</h3>
            <div className="space-y-3">
                {noticias.map(n => (
                    <div key={n.id} className="flex justify-between items-center bg-white border p-4 rounded shadow-sm">
                        <div className="flex items-center gap-4">
                            {n.imagenUrl && <img src={`${API_URL}${n.imagenUrl}`} className="w-16 h-16 object-cover rounded" />}
                            <h4 className="font-bold text-lg">{n.titulo}</h4>
                        </div>
                        <button onClick={() => borrar(n.id)} className="text-red-500 font-bold text-sm border border-red-200 px-3 py-1 rounded hover:bg-red-50">ELIMINAR</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* --- 3. PARTIDOS --- */
const PanelPartidos = () => {
    const [partidos, setPartidos] = useState([]);
    const [form, setForm] = useState({ rival: '', fecha: '', lugar: 'Local', resultado: '' });

    // CORRECCIÓN: Función antes del useEffect
    const cargar = async () => {
        try { const res = await axios.get(`${API_URL}/api/Partidos`); setPartidos(res.data); }
        catch (e) { console.error(e); }
    };

    useEffect(() => { cargar(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/Partidos`, form);
            alert('Partido agendado');
            setForm({ rival: '', fecha: '', lugar: 'Local', resultado: '' });
            cargar();
        } catch (error) { alert("Error al guardar partido."); console.error(error); }
    };

    const borrar = async (id) => {
        if (confirm("¿Borrar partido?")) {
            await axios.delete(`${API_URL}/api/Partidos/${id}`);
            cargar();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-black uppercase mb-6">➕ Agendar Partido</h2>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-10 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 items-end">
                <div className="flex-grow">
                    <label className="text-xs font-bold uppercase">Rival</label>
                    <input required name="rival" placeholder="Ej: Aranduroga" value={form.rival} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase">Fecha</label>
                    <input type="datetime-local" required name="fecha" value={form.fecha} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase">Condición</label>
                    <select name="lugar" value={form.lugar} onChange={handleChange} className="border p-2 rounded h-[42px]">
                        <option>Local</option>
                        <option>Visitante</option>
                    </select>
                </div>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded font-bold uppercase h-[42px]">Guardar</button>
            </form>

            <h3 className="font-black uppercase text-lg mb-4">Fixture</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partidos.map(p => (
                    <li key={p.id} className="border p-4 rounded bg-white shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">{new Date(p.fecha).toLocaleString()}</p>
                            <h4 className="font-black text-xl uppercase">Taraguy vs {p.rival}</h4>
                            <p className="text-sm">{p.lugar}</p>
                        </div>
                        <button onClick={() => borrar(p.id)} className="text-red-500 font-bold text-xs">X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/* --- 4. VENTAS --- */
const PanelVentas = () => {
    const [ordenes, setOrdenes] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/api/Ordenes`).then(res => setOrdenes(res.data)).catch(e => console.log("Sin ordenes"));
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-black uppercase mb-6">Historial de Ventas</h2>
            {ordenes.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded text-yellow-800 text-center">
                    <p className="font-bold">No hay ventas registradas aún.</p>
                </div>
            ) : (
                <p>Listado de ventas...</p>
            )}
        </div>
    );
};

export default Admin;