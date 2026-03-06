import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ cake }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="product-card">
            <Link to={`/cake/${cake._id}`}>
                <img src={`http://localhost:5000${cake.imageUrl}`} alt={cake.name} />
            </Link>
            <div className="product-info">
                <h3>{cake.name}</h3>
                <p className="category">{cake.category}</p>
                <div className="card-footer">
                    <span className="price">₹{cake.price}</span>
                    <button onClick={() => addToCart(cake)} className="add-btn">ADD</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
