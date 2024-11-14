const express = require('express');
const { updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT token
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Define storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Configure multer with storage
const upload = multer({ storage });

// Routes
router.put('/userdata', authMiddleware, updateProfile);

router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Send back the image URL for frontend use
        res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
