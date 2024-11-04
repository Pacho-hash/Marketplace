const express = require('express');
const ShoppingList = require('../models/ShoppingList'); // Ensure you have this model
const verifyToken = require('../middlewares/verifyToken');
const isUserOrAdmin = require('../middlewares/isAdmin'); // Ensure you have this middleware
const router = express.Router();

// Add item to shopping list
router.post('/add', verifyToken, isUserOrAdmin, async (req, res) => {
    const { itemName, quantity } = req.body;
    const userId = req.userId;

    try {
        const newItem = await ShoppingList.create({ userId, itemName, quantity });
        res.status(201).json({ message: 'Item added to shopping list', item: newItem });
    } catch (error) {
        console.error('Error adding item to shopping list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch shopping list
router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
        const shoppingList = await ShoppingList.findAll({ where: { userId } });
        res.json(shoppingList);
    } catch (error) {
        console.error('Error fetching shopping list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
