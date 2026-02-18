import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Inicializamos el carrito (idealmente podrías leerlo de localStorage aquí)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error loading cart from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // --- FUNCIÓN QUE FALTABA ---
    const getCartTotal = () => {
        // Sumamos el precio de todos los items
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    const addToCart = (product) => {
        // Asignamos un ID único a cada instancia en el carrito para diferenciar 
        // el mismo producto con distintas personalizaciones
        const cartItem = { ...product, _cartId: Date.now() + Math.random() };
        setCartItems(prev => [...prev, cartItem]);
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item._cartId !== cartId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            getCartTotal // <--- ¡AHORA SÍ LA EXPORTAMOS!
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
