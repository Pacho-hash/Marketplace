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
import { isAuthenticated } from './utils/auth'; // Import the auth check function

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
                </Routes>
            </div>
        </Router>
    );
};

export default App;
