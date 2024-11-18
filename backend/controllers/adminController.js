const User = require('../models/User');
const bcrypt = require('bcryptjs')


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


exports.createUser = async (req, res) => {
    try {
        const { username, email, password, profileImage, github, linkedin, twitter, unsplash } = req.body;
        // Validation
        if (!username || username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters." });
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        let user = new User({
            username: username,
            email: email,
            password: await bcrypt.hash(password, 10),
            profileImage: profileImage,
            github: github,
            linkedin: linkedin,
            twitter: twitter,
            unsplash: unsplash,
        })

        await user.save()
        console.log(user, 'from backend user creation')
        const savedUser = user.toObject();
        delete savedUser.password;
        return res.status(201).json({ message: "User created successfully.", user: savedUser });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
}
