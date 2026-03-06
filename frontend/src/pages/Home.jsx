import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const categories = [
    'Birthday Cakes',
    'Wedding Cakes',
    'Anniversary Cakes',
    'Custom Cakes'
];

const Home = () => {
    const [featuredCakes, setFeaturedCakes] = useState([]);

    useEffect(() => {
        const fetchCakes = async () => {
            const { data } = await axios.get('http://localhost:5000/api/cakes');
            setFeaturedCakes(data.slice(0, 8)); // Display first 8
        };
        fetchCakes();
    }, []);

    return (
        <div className="home-page">
            <section className="category-scroll">
                <h2>What's on your mind?</h2>
                <div className="categories-container">
                    {categories.map((cat) => (
                        <div key={cat} className="category-item">
                            <div className="category-circle">{cat[0]}</div>
                            <span>{cat}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="featured-section">
                <h2>Popular Cakes</h2>
                <div className="product-grid">
                    {featuredCakes.map((cake) => (
                        <ProductCard key={cake._id} cake={cake} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
