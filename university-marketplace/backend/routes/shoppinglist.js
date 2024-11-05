const express = require('express');
const ShoppingList = require('../models/ShoppingList'); // Ensure you have this model
const verifyToken = require('../middlewares/verifyToken');
const isUserOrAdmin = require('../middlewares/isAdmin'); // Ensure you have this middleware
const router = express.Router();

// Add item to shopping list
router.post('/add', verifyToken, async (req, res) => {
    const { itemName, quantity, price } = req.body;
    const userId = req.user.id;

    console.log('Request body:', req.body);

    if (!itemName || !quantity || price == null) {
        return res.status(400).json({ message: 'itemName, quantity, and price are required' });
    }

    try {
        const newItem = await ShoppingList.create({ userId, itemName, quantity, price });
        res.status(201).json({ message: 'Item added to shopping list', item: newItem });
    } catch (error) {
        console.error('Error adding item to shopping list:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Fetch shopping list
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.id;
    console.log('Fetching shopping list for userId:', userId);

    try {
        const shoppingList = await ShoppingList.findAll({ where: { userId } });
        console.log('Fetched shopping list:', shoppingList); // Log fetched data
        res.json(shoppingList);
    } catch (error) {
        console.error('Error fetching shopping list:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;