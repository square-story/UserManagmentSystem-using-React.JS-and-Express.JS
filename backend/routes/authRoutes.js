const express = require('express');
const {loginUser,registerUser, getUserDetails} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');



const router = express.Router();


router.post('/login', loginUser);

router.post('/register', registerUser);

router.get('/getUserDetails', authMiddleware,getUserDetails);



module.exports = router;





