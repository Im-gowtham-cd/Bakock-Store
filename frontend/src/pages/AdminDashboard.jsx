import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [cakes, setCakes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newCake, setNewCake] = useState({ name: '', description: '', price: '', category: 'Birthday Cakes', stock: 10 });
    const [image, setImage] = useState(null);

    const config = { headers: { Authorization: `Bearer ${user?.token}` } };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: cakeData } = await axios.get('http://localhost:5000/api/cakes');
        const { data: orderData } = await axios.get('http://localhost:5000/api/orders', config);
        setCakes(cakeData);
        setOrders(orderData);
    };

    const handleAddCake = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newCake.name);
        formData.append('description', newCake.description);
        formData.append('price', newCake.price);
        formData.append('category', newCake.category);
        formData.append('stock', newCake.stock);
        if (image) formData.append('image', image);

        try {
            await axios.post('http://localhost:5000/api/cakes', formData, {
                headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
            });
            alert('Cake added successfully');
            fetchData();
        } catch (error) {
            alert('Error adding cake');
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { orderStatus: status }, config);
            fetchData();
        } catch (error) {
            alert('Error updating status');
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <section className="add-cake-section">
                <h2>Add New Cake</h2>
                <form onSubmit={handleAddCake}>
                    <input type="text" placeholder="Name" value={newCake.name} onChange={(e) => setNewCake({ ...newCake, name: e.target.value })} required />
                    <textarea placeholder="Description" value={newCake.description} onChange={(e) => setNewCake({ ...newCake, description: e.target.value })} required />
                    <input type="number" placeholder="Price" value={newCake.price} onChange={(e) => setNewCake({ ...newCake, price: e.target.value })} required />
                    <select value={newCake.category} onChange={(e) => setNewCake({ ...newCake, category: e.target.value })}>
                        <option value="Birthday Cakes">Birthday Cakes</option>
                        <option value="Wedding Cakes">Wedding Cakes</option>
                        <option value="Anniversary Cakes">Anniversary Cakes</option>
                        <option value="Custom Cakes">Custom Cakes</option>
                    </select>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <button type="submit" className="primary-btn">ADD CAKE</button>
                </form>
            </section>

            <section className="orders-section">
                <h2>Manage Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>#{order._id.slice(-6)}</td>
                                <td>{order.userId?.name}</td>
                                <td>₹{order.totalPrice}</td>
                                <td className={`status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</td>
                                <td>
                                    <select onChange={(e) => handleUpdateStatus(order._id, e.target.value)} value={order.orderStatus}>
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminDashboard;
