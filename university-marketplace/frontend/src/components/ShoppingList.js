import React from 'react';
import './ShoppingList.css'; // Create and import CSS for styling

const ShoppingList = ({ shoppingList }) => {
    const total = shoppingList.reduce((sum, item) => sum + parseFloat(item.price), 0);

    return (
        <div className="shopping-list-container">
            <h2>Shopping List</h2>
            <div className="shopping-list-items">
                {shoppingList.length > 0 ? (
                    <ul>
                        {shoppingList.map((item) => (
                            <li key={item.id}>
                                <h3>{item.title}</h3>
                                <p>Price: ${item.price}</p>
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