import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../styles/Listing.css';

const Listing = () => {
    const [cakes, setCakes] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchCakes = async () => {
            const { data } = await axios.get('http://localhost:5000/api/cakes');
            setCakes(data);
        };
        fetchCakes();
    }, []);

    const categories = ['All', 'Birthday Cakes', 'Wedding Cakes', 'Anniversary Cakes', 'Custom Cakes'];

    const filteredCakes = filter === 'All' ? cakes : cakes.filter(c => c.category === filter);

    return (
        <div className="listing-page">
            <div className="filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={filter === cat ? 'active' : ''}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="product-grid">
                {filteredCakes.map(cake => (
                    <ProductCard key={cake._id} cake={cake} />
                ))}
            </div>
        </div>
    );
};

export default Listing;
