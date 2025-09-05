// src/routes/chatRoutes.js (ESM version)
import express from 'express';
import {
    createChatRoom,
    getAllChatRooms,
    getChatRoomDetails,
    joinChatRoom,
    leaveChatRoom
} from '../controllers/chatController.js'; // Import controller functions
import { body, param } from 'express-validator'; // For validation
import { fetchuser } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Validation for creating a chat room
const createChatRoomValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Chat room name is required.')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters.'),
    body('isPrivate')
        .optional() // Defaults to false in schema, so optional here
        .isBoolean().withMessage('isPrivate must be a boolean value.'),
];

// Validation for chat room ID parameter
const chatRoomIdValidation = [
    param('id')
        .isMongoId().withMessage('Invalid chat room ID format.'),
];

// POST /api/chatrooms: Create a new chat room. (Protected)
router.post('/', fetchuser, createChatRoomValidation, createChatRoom);

// GET /api/chatrooms: Get a list of all public chat rooms. (Protected for now, or public if desired)
router.get('/', fetchuser, getAllChatRooms); 

// GET /api/chatrooms/:id: Get details of a specific chat room (including recent messages). (Protected)
router.get('/:id', fetchuser, chatRoomIdValidation, getChatRoomDetails);

// PUT /api/chatrooms/:id/join: Join a chat room. (Protected)
router.get('/:id/join', fetchuser, chatRoomIdValidation, joinChatRoom);

// PUT /api/chatrooms/:id/leave: Leave a chat room. (Protected)
router.get('/:id/leave', fetchuser, chatRoomIdValidation, leaveChatRoom);

export default router;