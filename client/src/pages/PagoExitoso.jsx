import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PagoExitoso = () => {
  const { clearCart } = useCart();

  // Al cargar esta página, vaciamos el carrito automáticamente
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        
        {/* Ícono de Éxito animado */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
          <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          ¡Pago Exitoso!
        </h2>
        
        <p className="text-gray-500 mb-8">
          Tu pedido fue procesado correctamente. Te enviamos un email con los detalles de la compra.
        </p>

        <div className="space-y-3">
          <Link 
            to="/tienda" 
            className="block w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition transform hover:scale-105 uppercase text-sm"
          >
            Volver a la Tienda
          </Link>
          
          <Link 
            to="/" 
            className="block w-full text-gray-500 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition uppercase text-sm"
          >
            Ir al Inicio
          </Link>
        </div>
        
        <p className="mt-8 text-xs text-gray-400">
          Taraguy RC - Club Oficial
        </p>
      </div>
    </div>
  );
};

export default PagoExitoso;