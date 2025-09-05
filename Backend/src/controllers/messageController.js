

import ChatRoom from '../models/ChatRoom.js';
import { validationResult } from 'express-validator';
import Message from '../models/Message.js'
import User from '../models/User.js';

export const sendMessageToRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { roomId } = req.params;
    const { content, type, fileUrl, fileName } = req.body;
    const senderId = req.user.id;

    try {
        // Verify chat room exists and user is a member
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found.' });
        }
        if (!chatRoom.members.includes(senderId)) {
            return res.status(403).json({ message: 'You are not a member of this chat room.' });
        }

        const newMessage = new Message({
            chatRoom: roomId,
            sender: senderId,
            content,
            type: type || 'text',
            fileUrl: type !== 'text' ? fileUrl : undefined,
            fileName: type !== 'text' ? fileName : undefined,
        });

        const savedMessage = await newMessage.save();

        // Populate sender for the response
        await savedMessage.populate('sender', 'username avatar');

        res.status(201).json({
            message: 'Message sent successfully!',
            data: savedMessage
        });

     
    } catch (error) {
        console.error('Error sending message to room:', error);
        next(error);
    }
};

export const sendDirectMessage = async (req, res, next) => {
    const errors = validationResult(req); 
    console.log("Send Directe message is activated....");
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 


    const { receiverId } = req.params;
    console.log(receiverId);
    const senderId = req.user.id; 
    console.log(senderId);

    try {
        // Verify receiver exists
        const receiver = await User.findById(receiverId).populate('username avatar');  
        if (!receiver) {
            return res.status(404).json({ success:false, message: 'Receiver user not found.' });
        }
        if (senderId === receiverId) {
            return res.status(400).json({success:false, message: 'Cannot send a direct message to yourself.' });
        } 
        const newMessage = new Message({
                 content: [],
                receiver: receiverId,
                members:[receiverId,senderId]
        });
        const savedMessage = await newMessage.save();

        res.status(201).json({
            success:true,
            message: 'Direct message sent successfully!',
            chat: savedMessage
        });


    } catch (error) {
        console.error('Error sending direct message:', error);
        next(error);
    }
};

export const getRoomMessages = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { roomId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        // Verify chat room exists and user is a member
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found.' });
        }
        if (!chatRoom.members.includes(userId)) {
            return res.status(403).json({ message: 'You are not a member of this chat room.' });
        }

        const messages = await Message.find({ chatRoom: roomId })
                                      .sort({ timestamp: -1 }) // Sort by newest first
                                      .skip(skip)
                                      .limit(limit)
                                      .populate('sender', 'username avatar');

        const totalMessages = await Message.countDocuments({ chatRoom: roomId });
        const totalPages = Math.ceil(totalMessages / limit);

        res.status(200).json({success:true,
            message: `Messages for room ${roomId} retrieved successfully!`,
            data: messages,
            pagination: {
                totalItems: totalMessages,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                hasMore: page < totalPages
            }
        });

    } catch (error) {
        console.error('Error fetching room messages:', error);
        next(error);
    }
};

export const getDirectMessages = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success:false, errors: errors.array() });
    }

    const user1Id = req.user.id; // Authenticated user
    const { otherUserId } = req.params; // The other user in the conversation
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        // Ensure otherUserId exists
        const otherUser = await User.findById(otherUserId);
        if (!otherUser) {
            return res.status(404).json({success:false, message: 'Other user not found.' });
        }

        // Find messages where sender is user1 and receiver is user2 OR sender is user2 and receiver is user1
        // (This ensures all messages in the conversation are retrieved)
        const messages = await Message.find({
            $or: [
                { sender: user1Id, receiver: otherUserId },
                { sender: otherUserId, receiver: user1Id }
            ]
        })
        .sort({ timestamp: -1 }) // Newest messages first
        .skip(skip)
        .limit(limit)
        .populate('sender', 'username avatar'); // Populate sender details

        const totalMessages = await Message.countDocuments({
            $or: [
                { sender: user1Id, receiver: otherUserId },
                { sender: otherUserId, receiver: user1Id }
            ]
        });
        const totalPages = Math.ceil(totalMessages / limit);

        res.status(200).json({
            success:true,
            message: `Direct messages retrieved successfully between ${user1Id} and ${otherUserId}!`,
            data: messages,
            pagination: {
                totalItems: totalMessages,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                hasMore: page < totalPages
            }
        });

    } catch (error) {
        console.error('Error fetching direct messages:', error);
        next(error);
    }
};


export const markMessageAsRead = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { messageId } = req.params;
    const readerId = req.user.id;

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({success:false, message: 'Message not found.' });
        }

        // Ensure the reader is the receiver of a direct message
        // Or a member of the chat room in case of group messages
        if (message.receiver && message.receiver.toString() !== readerId) {
            return res.status(403).json({success:false, message: 'You are not authorized to mark this message as read.' });
        }


        if (!message.readBy.includes(readerId)) {
            message.readBy.push(readerId);
            await message.save();
        }

        res.status(200).json({
            success:true,
            message: 'Message marked as read!',
            data: message
        });


    } catch (error) {
        console.error('Error marking message as read:', error);
        next(error);
    }
};

export const  getMyChats = async (req, res) => {
    try {
        const userId = req.user.id; // User ID populated by fetchuser middleware

        // 1. Fetch Chat Rooms the user is a participant in
        // Assumes ChatRoom model has a 'members' field which is an array of user IDs
        const chatRooms = await ChatRoom.find({ members: userId })
            .populate('members', 'username email') // Populate participants' basic info
            .select('-messages') // Optionally, don't include all messages to keep initial payload small
            .lean(); // Convert Mongoose documents to plain JavaScript objects for easier manipulation
0
        // 2. Fetch Direct Messages involving the user
        // Assumes Message model has 'sender', 'receiver' fields and a way to distinguish direct messages (e.g., 'isDirect: true' or 'chatRoom: null')
        // We'll consider messages where 'chatRoom' field is null or undefined as direct messages.
        const directMessages = await Message.find({members:userId })
        .populate('receiver', 'username avatar')
        .sort({ createdAt: 1 }) // Sort by creation date to get messages in order
        .lean();

        // 3. Group direct messages by conversation partner
        console.log(directMessages);
        const directConversations = {};
        // directMessages.forEach(message => {
        //     // Determine the "other" user in the conversation
        //     const otherUser = message.sender._id.toString() === userId.toString() ? message.receiver : message.sender;
        //     const otherUserId = otherUser._id.toString();

        //     if (!directConversations[otherUserId]) {
        //         directConversations[otherUserId] = {
        //             usersChats: []
        //         };
        //     }
        //     directConversations[otherUserId].usersChats.push(message);
        // });

        // // 4. Convert the grouped direct conversations object into an array and add a 'type'
        // const directConversationsArray = Object.values(directConversations).map(conversation => ({
        //     ...conversation,
        //     type: 'direct'
        // }));

        // 5. Add a 'type' to the chat rooms as well
        // const chatRoomsWithTypes = chatRooms.map(room => ({
        //     ...room,
        //     type: 'group'
        // }));

        // // 6. Combine both arrays into a single 'chats' array
        // const allChats = [...chatRoomsWithTypes, ...directConversationsArray];

        res.status(200).json({
            success: true,
            chats: directMessages, // Use the new combined array
            message: 'User chats and direct conversations fetched successfully.'
        });

    } catch (error) {
        console.error('Error fetching user chats and messages:', error);
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};