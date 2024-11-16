const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    // console.log("Received token:", token);  // Log token to check if it’s being received
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId === 'admin' && decoded.isAdmin) {
            return next();
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};


module.exports = authMiddleware;
