const User = require('../models/User');



exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);  // Send users as a JSON response
    } catch (error) {
        console.error('Error fetching users:', error.message);
        return res.status(500).json({ message: 'Error fetching users' });  // Return a proper error message
    }
};