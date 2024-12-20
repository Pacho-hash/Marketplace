import React from 'react';
import './ShoppingList.css';
import { useNavigate } from 'react-router-dom';

const ShoppingList = ({ shoppingList, removeItem }) => {
    const total = shoppingList.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const navigate = useNavigate();

    return (
        <div className="shopping-list-container">
            <h2>Shopping List</h2>
            <div className="shopping-list-items">
                {shoppingList.length > 0 ? (
                    <ul>
                        {shoppingList.map((item) => (
                            <li key={item.id}>
                                <h3>{item.itemName}</h3>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price || 'N/A'}</p>
                                <button className="remove-button" onClick={() => removeItem(item.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items in the shopping list</p>
                )}
            </div>
            <div className="shopping-list-total">
                <h3>Total: ${total.toFixed(2)}</h3>
                <button className="go-to-cart-button" onClick={() => navigate('/cart')}>Go to Cart</button>
            </div>
        </div>
    );
};

export default ShoppingList;