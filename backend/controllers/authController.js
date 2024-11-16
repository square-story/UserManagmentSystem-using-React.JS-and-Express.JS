const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log('Validation failed: Missing email or password');
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Check admin credentials
        const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
        console.log('Admin check:', isAdmin);

        if (isAdmin) {
            console.log('Admin registration attempt blocked');
            return res.status(403).json({ success: false, message: 'Admin registration is not allowed' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        console.log('User lookup:', user);

        if (user) {
            console.log('User already exists');
            return res.status(400).json({ success: false, message: 'User already registered' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format');
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        console.log('Creating new user...');
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Generate JWT
        console.log('Generating JWT...');
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('User registered successfully');
        res.json({ token, isAdmin, user: { _id: user._id } });
    } catch (error) {
        console.error('Error during registration:', error.message || error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};




exports.loginUser = async (req, res) => {
    const {email,password} = req.body;
    try {
        const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
        let user;
        if(!isAdmin) {
            user = await User.findOne({email});
            if(!user){
                return res.status(400).json({message:'User Not Found'})
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({message:'Invalid Password'})
            }
        }
        const payload = {userId: isAdmin ? 'admin' : user._id,isAdmin};


        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
        res.json({ token, isAdmin, user: isAdmin ? null : { _id: user._id} });
    } catch (error) {
        console.error(error.message || error);
        res.status(500).send('Server Error')
    }
}


exports.getUserDetails = async (req, res) => {
    try {
        // Get the user ID from the JWT token (added to req by authMiddleware)
        const userId = req.user.userId;

        // Retrieve user details from the database
        const user = await User.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.json({ data: user });
    } catch (error) {
        console.error("Error fetching user details:", error.message || error);
        res.status(500).json({ message: 'Server error' });
    }
};