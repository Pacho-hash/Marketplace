import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/shopping-list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [token]);

    const removeItemFromCart = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/shopping-list/remove/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(cartItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    return (
        <div>
            <NavBar />
            <div className="cart-container">
                <h2>Cart</h2>
                <div className="payment-method">
                    <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            value="online"
                            checked={paymentMethod === 'online'}
                            onChange={handlePaymentMethodChange}
                        />
                        Pay Online
                    </label>
                    <label className={`payment-option ${paymentMethod === 'delivery' ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            value="delivery"
                            checked={paymentMethod === 'delivery'}
                            onChange={handlePaymentMethodChange}
                        />
                        Pay on Delivery
                    </label>
                </div>
                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    <div className="item-details">
                                        <h3>{item.itemName}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${item.price || 'N/A'}</p>
                                    </div>
                                    <button className="remove-button" onClick={() => removeItemFromCart(item.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No items in the cart</p>
                    )}
                </div>
                <div className="cart-total">
                    <h3>Total: ${total.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
};

export default Cart;