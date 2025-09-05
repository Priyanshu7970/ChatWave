import express, { json, urlencoded } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js'; // For historical messages
import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/db.js';


const app = express();

// Middlewares
app.use(json()); // Body parser for JSON
app.use(urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cors({ origin: process.env.CLIENT_URL })); // Enable CORS for your frontend

// connect database  
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatrooms', chatRoutes);
app.use('/api/messages', messageRoutes); 

app.get('/',(req,res)=>{
    res.status(200).send('Welcome to the chat application...');
})
// Health Check
app.get('/health', (req, res) => {
    res.status(200).send('Backend is healthy!');
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app ;