// routes/admin.js
const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// Update user role
router.put('/update-role/:userId', verifyToken, isAdmin, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = role;
        await user.save();
        res.json({ message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

// Delete item
router.delete('/delete-item/:itemId', verifyToken, isAdmin, async (req, res) => {
    const { itemId } = req.params;
    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.destroy();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
});

module.exports = router;