const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key'); // Use env variable for secret key
        req.userId = decoded.id; // Set userId in request
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = verifyToken;
