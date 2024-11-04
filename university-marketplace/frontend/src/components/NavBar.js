import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.png'; 

const NavBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted

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

        return () => {
            isMounted = false; // Cleanup function to set isMounted to false
        };
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/'); 
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#8B0000', 
            color: 'white',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={logo} 
                    alt="Marketplace Logo" 
                    style={{ height: '40px', marginRight: '10px', cursor: 'pointer' }} 
                    onClick={() => navigate('/')} 
                /> {/* Logo */}
                <button onClick={() => navigate('/about')} style={buttonStyle}>About</button>
                <button onClick={() => navigate('/contact')} style={buttonStyle}>Contact Us</button>
                {isAdmin && (
                    <>
                        <button onClick={() => navigate('/item-management')} style={buttonStyle}>Item Management</button>
                        <button onClick={() => navigate('/admin-panel')} style={buttonStyle}>Admin Panel</button>
                    </>
                )}
            </div>
            <div>
                <button onClick={() => navigate('/item')} style={buttonStyle}>Items</button>
            </div>
            <div>
                {token ? (
                    <>
                        <button onClick={() => navigate('/create-item')} style={buttonStyle}>Create Item</button>
                        <button onClick={handleLogout} style={buttonStyle}>Logout</button>
                        <button onClick={() => navigate('/profile')} style={buttonStyle}>Profile</button>
                        <button onClick={() => navigate('/user-dashboard')} style={buttonStyle}>UserDashboard</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')} style={buttonStyle}>Login</button>
                        <button onClick={() => navigate('/signup')} style={buttonStyle}>Sign Up</button>
                    </>
                )}
            </div>
        </div>
    );
};

const buttonStyle = {
    padding: '8px 12px', 
    border: '2px solid #c00', 
    borderRadius: '5px',
    backgroundColor: 'white',
    color: '#c00', 
    fontSize: '14px', 
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s', 
    margin: '5px' 
};

export default NavBar;