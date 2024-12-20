import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Login.css';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook to navigate after login

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            const token = response.data.token;

            // Store token in localStorage and show success message
            localStorage.setItem('token', token);
            setMessage('Login successful!');
            setLoading(false);

            // Navigate to User Dashboard after successful login
            navigate('/user-dashboard');
        } catch (error) {
            setLoading(false);
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <NavBar />
            <div className="form-container">
                <h2 className="title">Login</h2>
                <form onSubmit={handleLogin} className="form">
                    <div className="input-group">
                        <label className="label">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;