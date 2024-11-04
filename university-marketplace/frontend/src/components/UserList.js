import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        axios.get('http://localhost:5000/auth/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setUsers(response.data))
        .catch(error => console.error('Error fetching users:', error));
    }, []);

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search users..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            />
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>{user.username} - {user.role}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;