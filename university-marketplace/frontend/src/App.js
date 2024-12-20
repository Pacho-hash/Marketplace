// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import CreateItem from './components/CreateItem';
import ItemList from './components/ItemList';
import Contact from './components/Contact';
import About from './components/About';
import Profile from './components/Profile'; 
import UserDashboard from './components/UserDashboard';
import { isAuthenticated } from './utils/auth'; 
import AdminPanel from './components/AdminPanel';
import ItemManagement from './components/ItemManagement';
import ShoppingList from './components/ShoppingList';
import Cart from './components/Cart'; 



import './styles.css';

const App = () => {
    console.log('Is user authenticated?', isAuthenticated());
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/create-item" element={<CreateItem />} />
                    <Route path="/item" element={<ItemList />} /> 
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user-dashboard" 
                        element={isAuthenticated() ? <UserDashboard /> : <Navigate to="/login" />} 
                    />
                    <Route path="/admin-panel" element={<AdminPanel />} />
                    <Route path="/item-management" element={<ItemManagement />} />
                    <Route path="/shopping-list" element={<ShoppingList />} />
                    <Route path="/cart" element={<Cart />} />


                </Routes>
            </div>
        </Router>
    );
};

export default App;