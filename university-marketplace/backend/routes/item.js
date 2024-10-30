const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken'); 
const isAdmin = require('../middlewares/isAdmin'); // Import the admin middleware
const router = express.Router();

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Create item with image upload
router.post('/create-item', verifyToken, upload.single('image'), async (req, res) => {
    const { title, description, price } = req.body;
    const sellerId = req.user.id; // Use req.user.id
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    try {
        const newItem = await Item.create({ title, description, price, sellerId, imageUrl });
        return res.status(201).json({ message: 'Item created successfully!', item: newItem });
    } catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({ message: 'Error creating item' });
    }
});

// Fetch all items
router.get('/all', async (req, res) => {
    try {
        const items = await Item.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['username']
            }
        });
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

// Fetch user items
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.id; // Use req.user.id

    try {
        const items = await Item.findAll({
            where: { sellerId: userId },
            include: {
                model: User,
                as: 'user',
                attributes: ['username']
            }
        });
        res.json(items);
    } catch (error) {
        console.error('Error fetching user items:', error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

// Delete item (admin only)
router.delete('/delete-item/:id', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.destroy();
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ message: 'Error deleting item' });
    }
});

// Update item
router.put('/update-item/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, price } = req.body;

    try {
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.title = title || item.title;
        item.description = description || item.description;
        item.price = price || item.price;

        await item.save();

        return res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ message: 'Error updating item' });
    }
});

module.exports = router;