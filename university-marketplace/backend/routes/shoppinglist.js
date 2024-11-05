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
        // Check if the user already has 10 items in their shopping list
        const itemCount = await ShoppingList.count({ where: { userId } });
        if (itemCount >= 10) {
            return res.status(400).json({ message: 'You can only have up to 10 items in your shopping list' });
        }

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

// Remove item from shopping list
router.delete('/remove/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const item = await ShoppingList.findOne({ where: { id, userId } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await item.destroy();
        res.status(200).json({ message: 'Item removed from shopping list' });
    } catch (error) {
        console.error('Error removing item from shopping list:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;