const express = require('express');
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' })); 

app.use('/api/auth',authRoutes);

app.use('/api/profile',userRoutes)

app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));