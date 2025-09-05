import {model,Schema} from 'mongoose'
//  This is schema for user for user validation 
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Hashed password
    status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
    avatar: { type: String, default: 'default.png' },
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }
});

export default  model('User', userSchema); 