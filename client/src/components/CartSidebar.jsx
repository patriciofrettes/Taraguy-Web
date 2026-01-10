import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CartSidebar = () => {
    const { cart, removeFromCart, totalPrice, clearCart, isCartOpen, closeCart } = useCart();

    const getImagenUrl = (url) => {
        if (!url) return "/img/default_product.png";
        if (url.startsWith("http")) return url;
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${url}`;
    };

    const handleCheckout = async () => {
        try {
            const nuevaOrden = {
                nombreCliente: "Cliente",
                apellidoCliente: "Web",
                dni: "0",
                email: "test@test.com",
                telefono: "0",
                total: totalPrice,
                detalles: cart.map(item => ({
                    productoId: item.id,
                    nombreProducto: item.nombre,
                    talle: item.talle,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio
                }))
            };

            const responseOrden = await api.post('/Ordenes', nuevaOrden);
            const ordenId = responseOrden.data.id;

            const responsePago = await api.post('/MercadoPago/crear_preferencia', {
                items: cart,
                total: totalPrice,
                external_reference: ordenId.toString()
            });

            window.location.href = responsePago.data.url;
        } catch (error) {
            console.error("Error en pago:", error);
            alert("Hubo un error al procesar la compra.");
        }
    };

    return (
        <>
            {isCartOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={closeCart}></div>
            )}

            <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 bg-black text-white flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase">Tu Carrito</h2>
                    <button onClick={closeCart} className="text-2xl">✕</button>
                </div>

                <div className="p-6 overflow-y-auto h-[calc(100%-220px)]">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10 uppercase font-bold text-sm">El carrito está vacío</p>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item, index) => (
                                <div key={`${item.id}-${item.talle}-${index}`} className="flex gap-4 border-b pb-4">
                                    <img src={getImagenUrl(item.imagenUrl)} className="w-16 h-16 object-cover rounded" alt="prod" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-xs uppercase">{item.nombre}</h4>
                                        {item.talle && <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold">Talle: {item.talle}</span>}
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-900 font-bold text-sm">${item.precio.toLocaleString()}</span>
                                            <button onClick={() => removeFromCart(item.id, item.talle)} className="text-red-500 text-[10px] font-black uppercase">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-white p-6 border-t shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold uppercase text-gray-400 text-sm">Total</span>
                        <span className="text-2xl font-black">${totalPrice.toLocaleString()}</span>
                    </div>
                    {cart.length > 0 && (
                        <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-4 rounded font-black uppercase hover:bg-blue-700 transition">
                            Pagar con Mercado Pago
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;