import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const guardado = localStorage.getItem('carrito');
            return guardado ? JSON.parse(guardado) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, talleSeleccionado = null) => {
        setCart(prevCart => {
            // Buscamos si ya existe la combinación exacta de ID y TALLE
            const existeIndex = prevCart.findIndex(item =>
                item.id === product.id && item.talle === talleSeleccionado
            );

            if (existeIndex !== -1) {
                // Si existe, aumentamos cantidad
                const newCart = [...prevCart];
                newCart[existeIndex] = {
                    ...newCart[existeIndex],
                    cantidad: newCart[existeIndex].cantidad + 1
                };
                return newCart;
            } else {
                // Si es nuevo, lo agregamos manteniendo el nombre limpio
                return [...prevCart, {
                    ...product,
                    talle: talleSeleccionado,
                    cantidad: 1
                }];
            }
        });
        setIsCartOpen(true);
    };

    // Nueva función para bajar cantidad (útil para botones - y + en el carrito)
    const updateQuantity = (id, talle, valor) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === id && item.talle === talle) {
                    const nuevaCantidad = item.cantidad + valor;
                    return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
                }
                return item;
            });
        });
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
            updateQuantity, // <--- Nueva
            clearCart,
            totalItems,
            totalPrice,
            isCartOpen,
            openCart,
            closeCart
        }}>
            {children}
        </CartContext.Provider>
    );
};