const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ message: 'Server error' });
    }
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
        console.error('Error updating user role:', error);
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
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
});

module.exports = router;