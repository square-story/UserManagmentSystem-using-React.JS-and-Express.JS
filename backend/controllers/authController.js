const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already registered' });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Generate JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: { user: { _id: user._id, username: user.username, email: user.email }, token }
        });
    } catch (error) {
        console.error(error.message || error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'User Not Found'})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid Password'})
        }
        const payload = {userId:user._id};
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
        res.json({token});
    } catch (error) {
        console.error(error.message || error);
        res.status(500).send('Server Error')
    }
}