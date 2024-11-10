import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemList.css';
import NavBar from './NavBar';
import ShoppingList from './ShoppingList';
import shoppingCartIcon from '../assets/shopping-cart.png'; 

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [shoppingList, setShoppingList] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/items/all');
                setItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError('Failed to fetch items. Please try again.');
                setLoading(false);
            }
        };

        const fetchShoppingList = async () => {
            try {
                const response = await axios.get('http://localhost:5000/shopping-list', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setShoppingList(response.data);
            } catch (error) {
                console.error('Error fetching shopping list:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/items/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchItems();
        fetchShoppingList();
        fetchCategories();
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

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const toggleShoppingList = () => {
        setIsShoppingListOpen(!isShoppingListOpen);
    };

    const handleItemClick = (itemId) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory ? item.category === selectedCategory : true)
    );

    if (loading) {
        return <div className="item-list-container">Loading...</div>;
    }

    return (
        <div className="item-list-page">
            <NavBar shoppingList={shoppingList} />
            <div className="item-list-content">
                <div className="sidebar">
                    <h3>Categories</h3>
                    <ul className="category-list">
                        <li onClick={() => setSelectedCategory('')}>All Categories</li>
                        {categories.map((category, index) => (
                            <li key={index} onClick={() => setSelectedCategory(category)}>{category}</li>
                        ))}
                    </ul>
                </div>
                <div className="main-content">
                    <h2>Marketplace</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-bar"
                    />
                    <div className="item-list-grid">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div key={item.id} className={`item-card ${expandedItem === item.id ? 'expanded' : ''}`} onClick={() => handleItemClick(item.id)}>
                                    {item.imageUrl && (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="item-image"
                                        />
                                    )}
                                    <div className="item-info">
                                        <h3 className="item-title">{item.title}</h3>
                                        <p>{expandedItem === item.id ? item.description : truncateText(item.description, 100)}</p>
                                        <p className="item-price">Price: ${item.price}</p>
                                        <p className="item-quantity">Available: {item.quantity}</p>
                                        <p className="item-category">Category: {item.category}</p>
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
            </div>
            <button className="toggle-shopping-list bottom-right" onClick={toggleShoppingList}>
                <img src={shoppingCartIcon} alt="Shopping List" className="shopping-list-icon" />
            </button>
            {isShoppingListOpen && (
                <ShoppingList shoppingList={shoppingList} removeItem={removeItemFromShoppingList} />
            )}
        </div>
    );
};

export default ItemList;