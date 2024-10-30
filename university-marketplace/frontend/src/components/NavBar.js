import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.png'; // Replace with the path to your logo image

const NavBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:5000/auth/check-role', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.data.role === 'admin') {
                    setIsAdmin(true);
                }
            })
            .catch(error => console.error('Error checking user role:', error));
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/'); // Redirect to homepage
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#8B0000', // Set background color to dark red
            color: 'white',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="Marketplace Logo" style={{ height: '40px', marginRight: '10px' }} /> {/* Logo */}
                <button onClick={() => navigate('/about')} style={{ marginRight: '10px', color: 'white' }}>About</button>
                <button onClick={() => navigate('/contact')} style={{ color: 'white' }}>Contact Us</button>
                {isAdmin && (
                    <>
                        <button onClick={() => navigate('/item-management')} style={{ marginRight: '10px', color: 'white' }}>Item Management</button>
                        <button onClick={() => navigate('/admin-panel')} style={{ marginRight: '10px', color: 'white' }}>Admin Panel</button>
                    </>
                )}
            </div>
            <div>
                <button onClick={() => navigate('/item')} style={{ margin: '0 10px', color: 'white' }}>Items</button>
            </div>
            <div>
                {token ? (
                    <>
                        <button onClick={() => navigate('/create-item')} style={{ marginRight: '10px', color: 'white' }}>Create Item</button>
                        <button onClick={handleLogout} style={{ color: 'white' }}>Logout</button>
                        <button onClick={() => navigate('/profile')} style={{ marginRight: '10px', color: 'white' }}>Profile</button>
                        <button onClick={() => navigate('/user-dashboard')} style={{ marginRight: '10px', color: 'white' }}>UserDashboard</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')} style={{ marginRight: '10px', color: 'white' }}>Login</button>
                        <button onClick={() => navigate('/signup')} style={{ color: 'white' }}>Sign Up</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;