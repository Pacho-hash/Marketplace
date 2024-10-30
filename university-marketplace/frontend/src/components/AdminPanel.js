import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import NavBar from './NavBar'; 

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
        return <div>Access denied. Admins only.</div>;
    }

    return (
        <div>
            <NavBar />

            <h2>Admin Panel</h2>
            <input
                type="text"
                placeholder="Search users"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.role}
                        <button onClick={() => updateUserRole(user.id, 'admin')}>Make Admin</button>
                        <button onClick={() => updateUserRole(user.id, 'user')}>Remove Admin</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;