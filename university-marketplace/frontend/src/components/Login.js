import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import '../styles.css';

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
        }
    };

    return (
        <div style={styles.container}>
            <NavBar />
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '60px',
        backgroundColor: 'white',
        minHeight: '100vh',
        padding: '20px',
    },
    formContainer: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
    },
    title: {
        marginBottom: '20px',
        color: 'red',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        color: 'black',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'red',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
    },
    message: {
        marginTop: '15px',
        color: 'green',
    },
};

export default Login;
