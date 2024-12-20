import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemForm from './ItemForm';
import NavBar from './NavBar';
import './ItemManagement.css'; 

const ItemManagement = () => {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/auth/check-role', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setIsAdmin(response.data.role === 'admin');
            if (response.data.role === 'admin') {
                fetchItems();
            }
        })
        .catch(error => console.error('Error checking role:', error));
    }, []);

    const fetchItems = () => {
        axios.get('http://localhost:5000/items/all')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    };

    const deleteItem = (itemId) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:5000/items/delete-item/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setItems(items.filter(item => item.id !== itemId));
        })
        .catch(error => console.error('Error deleting item:', error));
    };

    const saveItem = (item) => {
        setEditingItem(null);
        fetchItems();
    };

    if (!isAdmin) {
        return <div className="access-denied">Access Denied</div>;
    }

    return (
        <div className="item-management-page">
            <NavBar />
            <div className="item-management-content">
                <h2>Item Management</h2>
                {editingItem && <ItemForm item={editingItem} onSave={saveItem} />}
                <ul className="item-list">
                    {items.map(item => (
                        <li key={item.id} className="item">
                            <div className="item-info">
                                {item.title} - ${item.price}
                            </div>
                            <div className="item-actions">
                                <button onClick={() => setEditingItem(item)} className="edit-button">Edit</button>
                                <button onClick={() => deleteItem(item.id)} className="delete-button">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ItemManagement;