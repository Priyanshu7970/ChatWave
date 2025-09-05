// src/controllers/authController.js
import User from '../models/User.js';
import {genSalt,hash,compare} from 'bcrypt'
import pkg from 'jsonwebtoken'; 
import { validationResult } from 'express-validator';
const {sign} = pkg; 
import { config } from 'dotenv'; 
config();


 export const registerUser = async (req, res, next) => {
    
    const jwt_secret = process.env.JWT_SECRET;
    // Checking for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success:false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({success:false, message: 'User with that email already exists.' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({sucess:false, message: 'User with that username already exists.' });
        }

        // Hash password
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        // Create new user
        user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Generate JWT token
        const token = sign({ id: user._id }, jwt_secret);

        res.status(201).json({
            success:true,
            message: 'User registered successfully!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        console.error(error.message);
        next(error); // Passing error to global error handler
    }
};

export const loginUser = async (req, res, next) => {
    // Checking for validation errors 
      const jwt_secret = process.env.JWT_SECRET;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Checking if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success:false, message: 'Invalid credentials.' });
        }

        // Checking if the password exists 
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({success:false, message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = sign({ id: user._id }, jwt_secret);

        res.status(200).json({ success:true,
            message: 'Logged in successfully!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        console.error(error.message);
        next(error);
    }
}; 
export const checkUser = async (req, res) => {
    try {
        const { username } = req.body;
        console.log("Hello from server....");
        console.log(username);

        if (!username) {
            return res.status(400).json({ success: false, message: 'Username is required.' });
        }
      const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

        if (user) {
            return res.status(400).json({ success: false, message: 'Username is already taken.' });
        } else {
            return res.status(200).json({ success: true, message: 'Username is available.' });
        }
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({ success: false, message: 'Server error during username check.' });
    }
}
