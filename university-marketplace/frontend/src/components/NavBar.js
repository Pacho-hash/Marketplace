import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png'; // Replace with the path to your logo image

const NavBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

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
            </div>
            <div>
                <button onClick={() => navigate('/item')} style={{ margin: '0 10px', color: 'white' }}>Items</button>
            </div>
            <div>
                {token ? (
                    <>
                        <button onClick={() => navigate('/create-item')} style={{ marginRight: '10px', color: 'white' }}>Create Item</button>
                        <button onClick={handleLogout} style={{ color: 'white' }}>Logout</button>
                        <button onClick={() => navigate('/profile')} style={{ marginRight: '10px' }}>Profile</button>
                        <button onClick={() => navigate('/user-dashboard')} style={{ marginRight: '10px' }}>UserDashboard</button>

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
