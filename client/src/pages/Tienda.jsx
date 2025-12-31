import { useState, useEffect } from 'react';
import api from '../api/axios'; // <--- IMPORTAMOS EL CENTRO DE CONEXIÓN
import ProductoCard from '../components/ProductoCard';

const Tienda = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                // YA NO USAMOS LOCALHOST, USAMOS 'api'
                const response = await api.get('/Productos');
                const activos = response.data.filter(p => p.activo === true);
                setProductos(activos);
            } catch (error) {
                console.error("Error cargando productos:", error);
            }
        };
        cargarProductos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-center mb-10 uppercase tracking-tighter">
                    Tienda Oficial
                </h1>
                {productos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {productos.map((prod) => (
                            <ProductoCard key={prod.id} producto={prod} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 font-bold">
                        Cargando productos...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tienda;