require('dotenv').config();
const express = require('express'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');  
const Item = require('../models/Item'); 
const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        return res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ message: 'Error creating account' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get user profile route
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userData } = user.dataValues;
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Update user profile route
router.put('/profile', verifyToken, async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});

router.post('/create-item', verifyToken, async (req, res) => {
    const { title, description, price } = req.body;
    const sellerId = req.userId;
    
    console.log("Creating item with sellerId:", sellerId);
    console.log('Request body:', req.body); // Log request body
    console.log('Uploaded file:', req.file); // Log uploaded file
    console.log('Seller ID (userId):', sellerId); // Log sellerId before creating the item
    // Validate input fields
    if (!title || !description || !price || !sellerId) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Check if seller exists
        const sellerExists = await User.findByPk(sellerId);
        if (!sellerExists) {
            return res.status(400).json({ message: 'Seller ID does not exist.' });
        }

        const newItem = await Item.create({ title, description, price, sellerId });
        return res.status(201).json({ message: 'Item created successfully!', item: newItem });
    } catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({ message: 'Error creating item', error: error.message });
    }
});



// Change Password route
router.put('/change-password', verifyToken, async (req, res) => { // Added verifyToken middleware here
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get user dashboard data route
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId); // Fetch user based on the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Fetch any additional data you want to include in the dashboard
        const dashboardData = {
            username: user.username,
            email: user.email,
            // Add other relevant user information or related data
            // For example, items the user has created
            items: await Item.findAll({ where: { sellerId: user.id } }), // Fetching items created by the user
        };
        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Fetch items created by the authenticated user
router.get('/items', verifyToken, async (req, res) => {
    try {
        const items = await Item.findAll({ where: { sellerId: req.userId } });
        if (!items.length) {
            return res.status(404).json({ message: 'No items found' });
        }
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// Delete item route
router.delete('/items/:id', verifyToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findOne({ where: { id: itemId, sellerId: req.userId } });
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }

        await item.destroy();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
    }
});


// Update item route
router.put('/items/:id', verifyToken, async (req, res) => {
    const { title, description, price } = req.body;
    const itemId = req.params.id;

    try {
        const item = await Item.findOne({ where: { id: itemId, sellerId: req.userId } });
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }

        item.title = title || item.title;
        item.description = description || item.description;
        item.price = price || item.price;
        await item.save();

        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Error updating item' });
    }
});

// Check role route
router.get('/check-role', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ role: user.role });
    } catch (error) {
        console.error('Error checking role:', error);
        res.status(500).json({ message: 'Error checking role' });
    }
});

// Check if admin route
router.get('/check-admin', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        res.json({ message: 'Access granted. Admin verified.' });
    } catch (error) {
        console.error('Error checking role:', error);
        res.status(500).json({ message: 'Error checking role' });
    }
});

// Fetch all users route
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

module.exports = router;
