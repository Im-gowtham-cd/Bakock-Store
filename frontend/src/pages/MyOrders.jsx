import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
            setOrders(data);
        };
        if (user) fetchOrders();
    }, [user]);

    return (
        <div className="orders-page">
            <h1>My Orders</h1>
            <div className="orders-list">
                {orders.length === 0 ? (
                    <p>You haven't placed any orders yet.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <span>Order ID: #{order._id.slice(-6)}</span>
                                <span className={`status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                            </div>
                            <div className="order-items">
                                {order.items.map((item) => (
                                    <p key={item.cakeId}>{item.name} x {item.quantity}</p>
                                ))}
                            </div>
                            <div className="order-footer">
                                <span>Total: ₹{order.totalPrice}</span>
                                <span>Payment: {order.paymentStatus}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
