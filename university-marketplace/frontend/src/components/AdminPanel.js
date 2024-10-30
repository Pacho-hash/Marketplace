import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import './AdminPanel.css'; // Import the new CSS file

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        // Check if the user is an admin
        axios.get('http://localhost:5000/auth/check-role', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data.role === 'admin') {
                setIsAdmin(true);
                // Fetch users only if the user is an admin
                return axios.get('http://localhost:5000/auth/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                // Handle non-admin access
                console.error('Access denied: Admins only.');
            }
        })
        .then(response => {
            if (response) {
                setUsers(response.data);
            }
        })
        .catch(error => console.error('Error fetching users or checking role:', error));
    }, []);

    const updateUserRole = (userId, role) => {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        axios.put(`http://localhost:5000/admin/update-role/${userId}`, { role }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const updatedUsers = users.map(user =>
                user.id === userId ? response.data.user : user
            );
            setUsers(updatedUsers);
        })
        .catch(error => console.error('Error updating user role:', error));
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    if (!isAdmin) {
        return <div className="access-denied">Access denied. Admins only.</div>;
    }

    return (
        <div className="admin-panel">
            <NavBar />
            <div className="admin-panel-content">
                <h2>Admin Panel</h2>
                <input
                    type="text"
                    placeholder="Search users"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-input"
                />
                <ul className="user-list">
                    {filteredUsers.map(user => (
                        <li key={user.id} className="user-item">
                            <div className="user-info">
                                {user.username} - {user.role}
                            </div>
                            <div className="user-actions">
                                <button onClick={() => updateUserRole(user.id, 'admin')} className="admin-button">Make Admin</button>
                                <button onClick={() => updateUserRole(user.id, 'user')} className="user-button">Remove Admin</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPanel;