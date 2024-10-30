import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemList.css'; // Import the CSS file
import NavBar from './NavBar'; // Adjust the path as needed

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/items/all');
                setItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return <div className="item-list-container">Loading...</div>;
    }

    return (
        <div className="item-list-page">
            <NavBar />
            <div className="item-list-content">
                <h2>Item Listings</h2>
                <div className="item-list-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={item.id} className="item-card">
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.title} className="item-image" />
                                )}
                                <div className="item-info">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <p className="item-price">Price: ${item.price}</p>
                                    <p className="item-user">Posted by: {item.user ? item.user.username : 'Unknown'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-items">No items available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemList;