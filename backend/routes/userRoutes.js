const express = require('express');
const {updateProfile} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT token

const router = express.Router()



router.put('/userdata',authMiddleware,updateProfile)

module.exports = router;






