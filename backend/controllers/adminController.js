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


exports.deleteUser = async (req, res) => {
    try {
        console.log('Deleting user',req.params.id);
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
