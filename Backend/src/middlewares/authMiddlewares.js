import pkg from 'jsonwebtoken';
const {verify} = pkg;
import {config} from 'dotenv'
config();
const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is in your .env file

export const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.headers['auth-token'];  
    if (!token) {
        return res.status(401).json({ error: "Invalid token" });
    }
    try {
        const data = verify(token, JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error:"Internal server error" });
    }
};