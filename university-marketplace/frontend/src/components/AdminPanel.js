// components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';


const AdminPanel = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const updateUserRole = (userId, role) => {
        axios.put(`/admin/update-role/${userId}`, { role })
            .then(response => {
                const updatedUsers = users.map(user =>
                    user.id === userId ? response.data.user : user
                );
                setUsers(updatedUsers);
            })
            .catch(error => console.error('Error updating user role:', error));
    };
    return (
        <div>
            <h2>Admin Panel</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.role}
                        <UserList users={users} onUpdateRole={updateUserRole} />
                        <button onClick={() => updateUserRole(user.id, 'admin')}>Make Admin</button>
                        <button onClick={() => updateUserRole(user.id, 'user')}>Remove Admin</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;