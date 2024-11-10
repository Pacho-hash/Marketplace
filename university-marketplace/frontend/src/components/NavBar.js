import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.png';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import './NavBar.css';

const NavBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (token) {
            axios.get('http://localhost:5000/auth/check-role', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (isMounted && response.data.role === 'admin') {
                    setIsAdmin(true);
                }
            })
            .catch(error => console.error('Error checking user role:', error));
        }

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            setDarkMode(true);
        }

        return () => {
            isMounted = false;
        };
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="navbar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={logo} 
                    alt="Marketplace Logo" 
                    onClick={() => navigate('/')} 
                />
                <button onClick={() => navigate('/about')} className="navbar-button">About</button>
                <button onClick={() => navigate('/contact')} className="navbar-button">Contact Us</button>
                {isAdmin && (
                    <>
                        <button onClick={() => navigate('/item-management')} className="navbar-button">Item Management</button>
                        <button onClick={() => navigate('/admin-panel')} className="navbar-button">Admin Panel</button>
                    </>
                )}
            </div>
            <div>
                <button onClick={() => navigate('/item')} className="navbar-button">Marketplace</button>
            </div>
            <div>
                {token ? (
                    <>
                        <button onClick={() => navigate('/create-item')} className="navbar-button">Create Item</button>
                        <button onClick={handleLogout} className="navbar-button">Logout</button>
                        <button onClick={() => navigate('/profile')} className="navbar-button">Profile</button>
                        <button onClick={() => navigate('/user-dashboard')} className="navbar-button">UserDashboard</button>
                        <button onClick={() => navigate('/cart')} className="navbar-button">Cart</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')} className="navbar-button">Login</button>
                        <button onClick={() => navigate('/signup')} className="navbar-button">Sign Up</button>
                    </>
                )}
                <button onClick={toggleDarkMode} className="navbar-button">
                    {darkMode ? <FaMoon /> : <FaSun />}
                </button>
            </div>
        </div>
    );
};

export default NavBar;