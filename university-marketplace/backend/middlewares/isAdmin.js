const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const user = await User.findByPk(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        req.userRole = user.role;
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ message: 'Server error' });
    }
};