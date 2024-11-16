const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, github, linkedin, twitter, unsplash,profileImage,selectedUser } = req.body;

        // Find the authenticated user by their ID (from the JWT token)
        const userId = req.user?.userId || selectedUser?._id;

        if (!userId) {
            return res.status(400).json({ message: "No user ID provided" });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user fields (we'll update only the fields that are provided)
        user.username = username || user.username;
        user.email = email || user.email;
        user.github = github || user.github;
        user.linkedin = linkedin || user.linkedin;
        user.twitter = twitter || user.twitter;
        user.unsplash = unsplash || user.unsplash;
        user.profileImage = profileImage || user.profileImage;

        // Save the updated user
        await user.save();

        // Respond with the updated user object
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
