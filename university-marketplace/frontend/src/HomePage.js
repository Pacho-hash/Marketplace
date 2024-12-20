import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar'; 
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; 

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/'); 
    };

    
    return (
        <div className="homepage">
            <NavBar />
            <div className="hero-section">
                <h1>Welcome to Near East Marketplace</h1>
                <p>Your one-stop shop for all your needs</p>
                <button onClick={() => navigate('/item')} className="cta-button">Start Shopping</button>
            </div>
        </div>
    );
};

export default Home;