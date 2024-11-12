const User = require('../models/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET; // Replace with a secure secret key

// Sign Up
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token with user name
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, name: user.name }); // Send the user's name back in the response
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
