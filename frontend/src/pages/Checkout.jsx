import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/Checkout.css';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [eventType, setEventType] = useState('None');
    const [eventDate, setEventDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate Payment Delay
        setTimeout(async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const orderData = {
                    items: cart.items,
                    totalPrice: cart.totalPrice + 40,
                    paymentMethod,
                    eventType,
                    eventDate: eventDate || null,
                    address,
                };

                await axios.post('http://localhost:5000/api/orders', orderData, config);
                clearCart();
                alert('Payment Successful! Order Placed.');
                navigate('/myorders');
            } catch (error) {
                alert('Order placement failed');
            } finally {
                setIsProcessing(false);
            }
        }, 2000);
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <form onSubmit={handlePlaceOrder} className="checkout-form">
                    <h2>Delivery Address</h2>
                    <textarea
                        placeholder="Enter full address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />

                    <h2>Occasion Details (Optional)</h2>
                    <div className="event-selection">
                        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                            <option value="None">No Occasion</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Anniversary">Anniversary</option>
                        </select>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            disabled={eventType === 'None'}
                        />
                    </div>

                    <h2>Payment Method</h2>
                    <div className="payment-options">
                        <label>
                            <input type="radio" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            Demo UPI Payment
                        </label>
                        <label>
                            <input type="radio" value="CARD" checked={paymentMethod === 'CARD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            Card Payment Simulation
                        </label>
                        <label>
                            <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            Cash on Delivery
                        </label>
                    </div>

                    <button type="submit" className="place-order-btn" disabled={isProcessing}>
                        {isProcessing ? 'Processing Payment...' : `PAY ₹${cart.totalPrice + 40}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
