const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken'); 
const router = express.Router();

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads'); // Corrected path to uploads directory
        cb(null, uploadDir); // Set destination to uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Initialize upload
const upload = multer({ storage });

// Create item with image upload
router.post('/create-item', verifyToken, upload.single('image'), async (req, res) => {
    const { title, description, price } = req.body;
    const sellerId = req.userId; // Use the user ID from the verified token
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null; // Construct the image URL

    try {
        const newItem = await Item.create({ title, description, price, sellerId, imageUrl });
        return res.status(201).json({ message: 'Item created successfully!', item: newItem });
    } catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({ message: 'Error creating item' });
    }
});

// Other routes unchanged
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

router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId;

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

module.exports = router;