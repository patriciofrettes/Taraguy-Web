import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Limpiamos errores anteriores

        try {
            // --- CONEXIÓN REAL AL BACKEND ---
            // CORREGIDO: Una sola vez https:// y una sola barra /
            const response = await axios.post('https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net/api/Auth/login', {
                usuario: usuario,
                password: password
            });

            // Si llegamos aquí, el Login fue EXITOSO (Status 200)
            console.log("Acceso concedido:", response.data);

            // 1. Guardamos la "llave" en el navegador
            localStorage.setItem('admin_token', 'true');

            // 2. Redirigimos al panel de administración
            navigate('/admin');

        } catch (err) {
            // Si falla (ej: contraseña mal, servidor apagado) entra aquí
            console.error("Error de login:", err);

            // Verificamos si es un error de credenciales (401) o de conexión
            if (err.response && err.response.status === 401) {
                setError('Usuario o contraseña incorrectos.');
            } else {
                setError('Error de conexión con el servidor.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">

                {/* CABECERA NEGRA */}
                <div className="bg-black p-8 text-center">
                    {/* Asegúrate de que esta ruta de imagen sea correcta en tu proyecto */}
                    <img src="/img/logo.png" alt="Taraguy" className="w-20 h-20 mx-auto object-contain mb-4" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Acceso Restringido</h2>
                    <p className="text-gray-400 text-sm mt-2">Panel de Administración</p>
                </div>

                {/* FORMULARIO */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Usuario</label>
                            <input
                                type="text"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition"
                                placeholder="admin"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-100 text-red-600 p-3 rounded text-sm font-bold text-center border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 font-black uppercase tracking-widest rounded hover:bg-gray-800 transition transform active:scale-95"
                        >
                            Ingresar
                        </button>

                        <div className="text-center mt-4">
                            <a href="/" className="text-xs text-gray-400 font-bold uppercase hover:text-black">
                                &larr; Volver al inicio
                            </a>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Login;