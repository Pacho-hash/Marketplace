import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import './Cart.css';
import './CreditCard.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cardType, setCardType] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
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

    const handlePayNow = async () => {
        if (!cardNumber || cardNumber.length !== 16 || !expiryDate || expiryDate.length !== 5 || !cvv || cvv.length !== 3 || !firstName || !lastName) {
            alert('Please fill in all payment details correctly.');
            return;
        }

        setLoading(true);

        try {
            // Simulate payment process
            await axios.post('http://localhost:5000/auth/payment', {
                cartItems,
                paymentDetails: {
                    cardNumber,
                    expiryDate,
                    cvv,
                    firstName,
                    lastName,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Clear cart items from database
            await axios.delete('http://localhost:5000/shopping-list/clear', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Clear cart items in the frontend
            setCartItems([]);
            setTimeout(() => {
                setLoading(false);
                setPaymentSuccess(true);
                setTimeout(() => {
                    setPaymentSuccess(false);
                }, 3000);
            }, 3000);
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        setCardNumber(value);

        if (value.startsWith('4')) {
            setCardType('visa');
        } else if (value.startsWith('5')) {
            setCardType('mastercard');
        } else {
            setCardType('');
        }
    };

    const handleExpiryDateChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setExpiryDate(value.replace(/(\d{2})(\d{0,2})/, '$1/$2'));
        }
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
        setCvv(value);
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        setFirstName(value);
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        setLastName(value);
    };

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    return (
        <div>
            <NavBar />
            {loading && (
                <div className="loading-screen">
                    <p>Loading...</p>
                </div>
            )}
            {paymentSuccess && (
                <div className="payment-success">
                    <p>Payment successful! Thank you for shopping.</p>
                </div>
            )}
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
                {paymentMethod === 'online' && (
                    <div className="payment-form">
                        <h3>Enter Payment Details</h3>
                        <div className="credit-card">
                            {cardType === 'visa' && <img src="/images/visa-logo.png" alt="Visa" className="card-logo" />}
                            {cardType === 'mastercard' && <img src="/images/mastercard-logo.png" alt="MasterCard" className="card-logo" />}
                            <div className="card-number">{cardNumber.padEnd(16, '•')}</div>
                            <div className="expiry-date">{expiryDate.padEnd(5, '•')}</div>
                            <div className="cvv">{cvv.padEnd(3, '•')}</div>
                            <div className="name">{`${firstName} ${lastName}`}</div>
                        </div>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={handleFirstNameChange}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={handleLastNameChange}
                        />
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                        />
                        <input
                            type="text"
                            placeholder="Expiry Date (MM/YY)"
                            value={expiryDate}
                            onChange={handleExpiryDateChange}
                        />
                        <input
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={handleCvvChange}
                        />
                        <button className="pay-now-button" onClick={handlePayNow}>Pay Now</button>
                    </div>
                )}
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