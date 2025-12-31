import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CartSidebar = () => {
    // Traemos las funciones del contexto nuevo
    const { cart, removeFromCart, totalPrice, clearCart, isCartOpen, closeCart } = useCart();

    // Lógica de MercadoPago (Simplificada para este ejemplo)
    const handleCheckout = async () => {
        try {
            const response = await axios.post('https://localhost:7235/api/MercadoPago/crear_preferencia', {
                items: cart,
                total: totalPrice,
                datosCliente: { nombre: "Cliente", apellido: "Web", email: "test@test.com" }
            });
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error en pago:", error);
            alert("Hubo un error al procesar el pago.");
        }
    };

    return (
        <>
            {/* FONDO OSCURO (Overlay) - Cierra al hacer click afuera */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
                    onClick={closeCart}
                ></div>
            )}

            {/* PANEL LATERAL */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* CABECERA */}
                <div className="p-6 bg-black text-white flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase">Tu Carrito</h2>
                    <button onClick={closeCart} className="text-gray-400 hover:text-white text-2xl font-bold">✕</button>
                </div>

                {/* LISTA DE PRODUCTOS */}
                <div className="p-6 overflow-y-auto h-[calc(100%-200px)]">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">El carrito está vacío 😔</p>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item, index) => (
                                <div key={`${item.id}-${item.talle}-${index}`} className="flex gap-4 border-b border-gray-100 pb-4">
                                    <img src={item.imagenUrl ? `https://localhost:7235${item.imagenUrl}` : '/img/default.jpg'} className="w-16 h-16 object-cover rounded" alt="prod" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm uppercase">{item.nombre}</h4>
                                        {/* Mostramos el talle si existe */}
                                        {item.talle && <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">Talle: {item.talle}</span>}
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-500 text-xs">{item.cantidad} x ${item.precio}</span>
                                            <button onClick={() => removeFromCart(item.id, item.talle)} className="text-red-500 text-xs font-bold hover:underline">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FOOTER (TOTAL Y BOTÓN) */}
                <div className="absolute bottom-0 left-0 w-full bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-black text-green-600">${totalPrice.toLocaleString()}</span>
                    </div>
                    {cart.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <button onClick={handleCheckout} className="w-full bg-blue-500 text-white py-3 rounded font-bold uppercase hover:bg-blue-600 transition">
                                Pagar con Mercado Pago
                            </button>
                            <button onClick={clearCart} className="w-full text-gray-400 text-xs hover:text-red-500 underline">
                                Vaciar Carrito
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;