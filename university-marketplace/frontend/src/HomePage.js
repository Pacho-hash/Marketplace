import React from 'react';
import NavBar from './components/NavBar'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/'); // Redirect to homepage
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <NavBar />
        <h1>Welcome to Near East Marketplace</h1>
    </div>
);
};

export default Home;
