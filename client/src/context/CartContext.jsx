import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // 1. Lógica de Persistencia (Guardar en memoria)
    const [cart, setCart] = useState(() => {
        try {
            const guardado = localStorage.getItem('carrito');
            return guardado ? JSON.parse(guardado) : [];
        } catch {
            return [];
        }
    });

    // 2. Estado para ABRIR/CERRAR el carrito (Esto faltaba)
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(cart));
    }, [cart]);

    // 3. Agregar con Talles
    const addToCart = (product, talleSeleccionado = null) => {
        setCart(prevCart => {
            const existe = prevCart.find(item =>
                item.id === product.id && item.talle === talleSeleccionado
            );

            if (existe) {
                return prevCart.map(item =>
                    (item.id === product.id && item.talle === talleSeleccionado)
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                const nombreFinal = talleSeleccionado
                    ? `${product.nombre} (${talleSeleccionado})`
                    : product.nombre;

                return [...prevCart, {
                    ...product,
                    nombre: nombreFinal,
                    talle: talleSeleccionado,
                    cantidad: 1
                }];
            }
        });
        // Abrir el carrito automáticamente al comprar
        setIsCartOpen(true);
    };

    const removeFromCart = (id, talle) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === id && item.talle === talle)));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalItems,
            totalPrice,
            isCartOpen,  // <--- Nuevo
            openCart,    // <--- Nuevo
            closeCart    // <--- Nuevo
        }}>
            {children}
        </CartContext.Provider>
    );
};