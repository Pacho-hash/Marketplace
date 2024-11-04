import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'; 
import './Profile.css'; 

const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/login'); // Redirect to login if not authenticated
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('http://localhost:5000/auth/profile', { username, email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log('Changing password with token:', token); 
        console.log('Old Password:', oldPassword); // Debug log
        console.log('New Password:', newPassword); // Debug log
        try {
            const response = await axios.put(
                'http://localhost:5000/auth/change-password',
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPasswordMessage(response.data.message);
            setOldPassword(''); // Clear old password input
            setNewPassword(''); // Clear new password input
        } catch (error) {
            console.error('Error changing password:', error); 
            setPasswordMessage(error.response?.data?.message || 'Error changing password');
        }
    };

    return (
        <div className="profile-page">
            <NavBar />
            <div className="profile-content">
                <h2>User Profile</h2>
                <form onSubmit={handleUpdateProfile} className="profile-form">
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="update-button">Update Profile</button>
                </form>
                {message && <p className="message">{message}</p>}

                <h3>Change Password</h3>
                <form onSubmit={handleChangePassword} className="password-form">
                    <div className="form-group">
                        <label>Old Password:</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="change-password-button">Change Password</button>
                </form>
                {passwordMessage && <p className="password-message">{passwordMessage}</p>}
            </div>
        </div>
    );
};

export default Profile;