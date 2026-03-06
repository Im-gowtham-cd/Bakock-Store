import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const { user } = useContext(AuthContext);

    const fetchCart = async () => {
        if (user) {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/cart', config);
            setCart(data);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (cake, quantity = 1) => {
        if (user) {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/cart', {
                cakeId: cake._id,
                name: cake.name,
                price: cake.price,
                imageUrl: cake.imageUrl,
                quantity,
            }, config);
            setCart(data);
        } else {
            // Handle guest cart if needed, or redirect to login
            alert('Please login to add items to cart');
        }
    };

    const removeFromCart = async (cakeId) => {
        if (user) {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.delete(`http://localhost:5000/api/cart/${cakeId}`, config);
            setCart(data);
        }
    };

    const clearCart = () => {
        setCart({ items: [], totalPrice: 0 });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
