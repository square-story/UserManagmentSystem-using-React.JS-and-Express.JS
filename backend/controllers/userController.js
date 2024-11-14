const User = require('../models/User');

exports.updateProfile = async(req,res)=>{
    try {
        const { username, email, profileImage, github, linkedin, twitter, unsplash } = req.body;

        console.log(req.user, '==from update module')

        // Find the authenticated user by their ID (from the JWT token)
        const user = await User.findById(req.user.userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user fields (we'll update only the fields that are provided)
        user.username = username || user.username;
        user.email = email || user.email;
        user.profileImage = profileImage || user.profileImage;
        user.github = github || user.github;
        user.linkedin = linkedin || user.linkedin;
        user.twitter = twitter || user.twitter;
        user.unsplash = unsplash || user.unsplash;

        // Save the updated user
        await user.save();

        // Respond with the updated user object
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}