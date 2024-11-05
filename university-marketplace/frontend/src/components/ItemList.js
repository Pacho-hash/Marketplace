import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemList.css';
import NavBar from './NavBar';
import ShoppingList from './ShoppingList';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shoppingList, setShoppingList] = useState([]);
    const [error, setError] = useState('');

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

        const fetchShoppingList = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/shopping-list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setShoppingList(response.data);
            } catch (error) {
                console.error('Error fetching shopping list:', error);
            }
        };

        fetchItems();
        fetchShoppingList();
    }, []);

    const addToShoppingList = async (item) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/shopping-list/add',
                { itemName: item.title, quantity: 1, price: item.price },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            const newItem = response.data.item;
            setShoppingList([...shoppingList, newItem]);
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Error adding item to shopping list:', error);
            setError(error.response?.data?.message || 'Failed to add item to shopping list');
        }
    };

    const removeItemFromShoppingList = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/shopping-list/remove/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setShoppingList(shoppingList.filter(item => item.id !== itemId));
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Error removing item from shopping list:', error);
        }
    };

    if (loading) {
        return <div className="item-list-container">Loading...</div>;
    }

    return (
        <div className="item-list-page">
            <NavBar shoppingList={shoppingList} />
            <div className="item-list-content">
                <h2>Item Listings</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="item-list-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div key={item.id} className="item-card">
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="item-image"
                                    />
                                )}
                                <div className="item-info">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <p className="item-price">Price: ${item.price}</p>
                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                    <p className="item-user">
                                        Posted by: {item.user ? item.user.username : 'Unknown'}
                                    </p>
                                    <button onClick={() => addToShoppingList(item)}>
                                        Add to Shopping List
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-items">No items available</p>
                    )}
                </div>
            </div>
            <ShoppingList shoppingList={shoppingList} removeItem={removeItemFromShoppingList} />
        </div>
    );
};

export default ItemList;