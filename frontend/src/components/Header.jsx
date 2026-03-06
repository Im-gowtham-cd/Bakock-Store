import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import '../styles/Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">Bakock</Link>
                <div className="search-bar">
                    <input type="text" placeholder="Search for cakes..." />
                </div>
                <nav className="nav-links">
                    <Link to="/cakes">Browse</Link>
                    {user ? (
                        <>
                            <Link to="/myorders">Orders</Link>
                            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                            <button onClick={logout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                    <Link to="/cart" className="cart-link">
                        Cart <span>({cart.items.length})</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
