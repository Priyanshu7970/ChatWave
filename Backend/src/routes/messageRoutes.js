// src/routes/messageRoutes.js (ESM version)
import express from 'express';
import { fetchuser } from '../middlewares/authMiddlewares.js';
import {
    sendMessageToRoom,
    sendDirectMessage,
    getRoomMessages,
    getDirectMessages,
    markMessageAsRead,
    getMyChats
} from '../controllers/messageController.js'; 
import { body, param, query } from 'express-validator'; 

const router = express.Router(); 




// Validation for common ID parameters
const messageIdValidation = [
    param('messageId')
        .isMongoId().withMessage('Invalid message ID format.'),
];
const roomIdValidation = [
    param('roomId')
        .isMongoId().withMessage('Invalid room ID format.'),
];
const receiverIdValidation = [
    param('receiverId')
        .isMongoId().withMessage('Invalid user ID format.'),
];
const otherUserIdValidation = [
    param('otherUserId')
        .isMongoId().withMessage('Invalid other user ID format.'),
];

// Validation for pagination queries
const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer.')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100.')
        .toInt(),
];


// POST /api/messages/room/:roomId: Send a message to a chat room
router.post('/room/:roomId', fetchuser, roomIdValidation, sendMessageToRoom);

// POST /api/messages/direct/:receiverId: Send a direct message. (fetchusered)
router.post('/direct/:receiverId', fetchuser, sendDirectMessage); 
// Reusing userIdValidation for receiverId

// GET /api/messages/room/:roomId: Get paginated messages for a specific chat room (historical). (fetchusered)
router.get('/room/:roomId', fetchuser, roomIdValidation, paginationValidation, getRoomMessages);

// GET /api/messages/my-chats:

router.get('/my-chats', fetchuser, getMyChats);
// GET /api/messages/direct/:otherUserId: Get paginated direct messages between two users (historical). (fetchusered)
// The authenticated user's ID is req.user.id, and the other user's ID is from the URL param.
router.get('/direct/:otherUserId', fetchuser, otherUserIdValidation, paginationValidation, getDirectMessages);

// PUT /api/messages/:messageId/read: Mark a message as read. (fetchuser)
router.put('/:messageId/read', fetchuser, messageIdValidation, markMessageAsRead);

export default router;