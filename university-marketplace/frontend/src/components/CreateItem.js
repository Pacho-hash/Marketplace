import React, { useState } from 'react';
import axios from 'axios';
import './CreateItem.css';
import '../styles.css';
import NavBar from './NavBar';


const CreateItem = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCreateItem = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); 
        console.log("Token:", token); // Log the token for debugging
        

        // Check if all fields are filled out
        if (!title || !description || !price) {
            setMessage('Please fill out all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/items/create-item', // Ensure this is correct
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setMessage(response.data.message || 'Item created successfully!');
            // Reset form fields after successful submission
            setTitle('');
            setDescription('');
            setPrice('');
            setImage(null);
        } catch (error) {
            console.error('Error creating item:', error); // Log error object
            console.error('Detailed error:', error.stack); // Log stack trace
            
            setMessage(error.response?.data?.message || 'Error creating item');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <NavBar />
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
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit">Create Item</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateItem;
