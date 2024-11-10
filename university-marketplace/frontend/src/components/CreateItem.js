import React, { useState } from 'react';
import axios from 'axios';
import './CreateItem.css';
import NavBar from './NavBar';

const CreateItem = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCreateItem = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        console.log("Token:", token);

        if (!title || !description || !price || !quantity || !category) {
            setMessage('Please fill out all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/items/create-item',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setMessage(response.data.message || 'Item created successfully!');
            setTitle('');
            setDescription('');
            setPrice('');
            setQuantity('');
            setCategory('');
            setImage(null);
        } catch (error) {
            console.error('Error creating item:', error);
            console.error('Detailed error:', error.stack);
            setMessage(error.response?.data?.message || 'Error creating item');
        }
    };

    return (
        <div className="create-item-page">
            <NavBar />
            <div className="create-item-container">
                <h2>Create Item</h2>
                <form onSubmit={handleCreateItem}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Books">Books</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button type="submit" className="cta-button">Create Item</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default CreateItem;