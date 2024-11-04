import React, { useState } from 'react';
import axios from 'axios';

const ItemForm = ({ item, onSave }) => {
    const [title, setTitle] = useState(item ? item.title : '');
    const [price, setPrice] = useState(item ? item.price : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { title, price };
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        if (item) {
            // Update item
            axios.put(`http://localhost:5000/items/update-item/${item.id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => onSave(response.data))
            .catch(error => console.error('Error updating item:', error));
        } else {
            // Create item
            axios.post('http://localhost:5000/items', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => onSave(response.data))
            .catch(error => console.error('Error creating item:', error));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <button type="submit">{item ? 'Update' : 'Create'} Item</button>
        </form>
    );
};

export default ItemForm;