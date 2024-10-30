import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editData, setEditData] = useState({ title: '', description: '', price: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
        
            if (!token) {
                navigate('/login');
                return;
            }
        
            try {
                // Fetch user profile
                const userResponse = await axios.get('http://localhost:5000/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(userResponse.data);
        
                // Fetch user's items
                const itemsResponse = await axios.get('http://localhost:5000/items', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setItems(itemsResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                navigate('/login');
            }
        };
    
        fetchDashboardData();
    }, [navigate]);

    const handleDelete = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`http://localhost:5000/items/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Delete response:", response.data); // Log response data
            setItems(items.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditData({ title: item.title, description: item.description, price: item.price });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleEditSubmit = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`http://localhost:5000/items/${itemId}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Edit response:", response.data); // Log response data

            // Update item in state
            const updatedItems = items.map(item =>
                item.id === itemId ? { ...item, ...editData } : item
            );
            setItems(updatedItems);
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <NavBar />
            <div className="dashboard-content">
                <h2>User Dashboard</h2>
                {userData && (
                    <div className="user-info">
                        <h3>Welcome, {userData.username}</h3>
                        <p>Email: {userData.email}</p>
                    </div>
                )}
                <h3>Your Listings</h3>
                <ul className="item-list">
                    {items.length > 0 ? (
                        items.map(item => (
                            <li key={item.id} className="item">
                                {editingItem?.id === item.id ? (
                                    <div className="edit-form">
                                        <input 
                                            type="text" 
                                            name="title" 
                                            value={editData.title} 
                                            onChange={handleEditChange} 
                                            placeholder="Title" 
                                        />
                                        <textarea 
                                            name="description" 
                                            value={editData.description} 
                                            onChange={handleEditChange} 
                                            placeholder="Description"
                                        />
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={editData.price} 
                                            onChange={handleEditChange} 
                                            placeholder="Price" 
                                        />
                                        <button onClick={() => handleEditSubmit(item.id)}>Save</button>
                                        <button onClick={() => setEditingItem(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                        <p>Price: ${item.price}</p>
                                        {item.imageUrl && (
                                            <img src={item.imageUrl} alt={item.title} className="item-image" />
                                        )}
                                        <button className="edit-button" onClick={() => handleEditClick(item)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No items found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
