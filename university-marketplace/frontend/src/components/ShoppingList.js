import React from 'react';
import './ShoppingList.css'; // Create and import CSS for styling

const ShoppingList = ({ shoppingList }) => {
    const total = shoppingList.reduce((sum, item) => sum + parseFloat(item.price || 0), 0); // Ensure price is handled correctly

    return (
        <div className="shopping-list-container">
            <h2>Shopping List</h2>
            <div className="shopping-list-items">
                {shoppingList.length > 0 ? (
                    <ul>
                        {shoppingList.map((item) => (
                            <li key={item.id}>
                                <h3>{item.itemName}</h3> {/* Use itemName */}
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price || 'N/A'}</p> {/* Ensure price is displayed */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items in the shopping list</p>
                )}
            </div>
            <div className="shopping-list-total">
                <h3>Total: ${total.toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default ShoppingList;