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
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <NavBar />
            <h2>Item Listings</h2>
            <div>
                {items.length > 0 ? (
                    <ul>
                        {items.map((item) => (
                            <li key={item.id} className="item">
                                {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: 'auto' }} />} {/* Display image */}
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <p>Price: ${item.price}</p>
                                <p>Posted by: {item.user ? item.user.username : 'Unknown'}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-items">No items available</p>
                )}
            </div>
        </div>
    );
};

export default ItemList;
