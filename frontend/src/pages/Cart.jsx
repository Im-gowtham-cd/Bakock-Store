import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    if (cart.items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>You can go to home page to view more cakes</p>
                <Link to="/" className="primary-btn">SEE CAKES NEAR YOU</Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-items">
                    <h2>Items in your cart</h2>
                    {cart.items.map((item) => (
                        <div key={item.cakeId} className="cart-item">
                            <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} />
                            <div className="item-info">
                                <h3>{item.name}</h3>
                                <p>₹{item.price}</p>
                            </div>
                            <div className="item-actions">
                                <span>Qty: {item.quantity}</span>
                                <button onClick={() => removeFromCart(item.cakeId)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Bill Details</h2>
                    <div className="summary-row">
                        <span>Item Total</span>
                        <span>₹{cart.totalPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                    </div>
                    <div className="summary-total">
                        <span>TO PAY</span>
                        <span>₹{cart.totalPrice + 40}</span>
                    </div>
                    <button onClick={() => navigate('/checkout')} className="checkout-btn">
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
