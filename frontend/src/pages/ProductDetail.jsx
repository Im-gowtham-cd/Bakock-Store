import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [cake, setCake] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchCake = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/cakes/${id}`);
            setCake(data);
        };
        fetchCake();
    }, [id]);

    if (!cake) return <div className="loading">Loading...</div>;

    return (
        <div className="product-detail-page">
            <div className="detail-container">
                <div className="image-section">
                    <img src={`http://localhost:5000${cake.imageUrl}`} alt={cake.name} />
                </div>
                <div className="info-section">
                    <h1>{cake.name}</h1>
                    <p className="category">{cake.category}</p>
                    <p className="description">{cake.description}</p>
                    <div className="price-tag">₹{cake.price}</div>

                    <div className="selector-container">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => addToCart(cake, quantity)} className="add-to-cart-btn">
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
