import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import './Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');  
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!phoneNumber.startsWith('0090')) {  
            setMessage('Phone number must start with 0090');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/auth/signup', {
                username,
                email,
                password,
                phoneNumber 
            });
            setMessage(response.data.message || 'Signup successful!');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setMessage(error.response?.data?.message || 'Error creating account');
        }
    };

    return (
        <div className="signup-container">
            <NavBar />
            <div className="form-container">
                <h2 className="title">Signup</h2>
                <form onSubmit={handleSignup} className="form">
                    <div className="input-group">
                        <label className="label">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
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
                    <div className="input-group">  {/* New input group for phone number */}
                        <label className="label">Phone Number:</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Signing up...' : 'Signup'}
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Signup;