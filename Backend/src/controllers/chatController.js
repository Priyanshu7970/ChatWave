// src/controllers/chatController.js (ESM version)
import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';
import { validationResult } from 'express-validator';

export const createChatRoom = async (req, res, next) => {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, isPrivate } = req.body;
    const admin = req.user.id; // Get admin from authenticated user (set by protect middleware)

    try {

        const existingRoom = await ChatRoom.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ message: 'A chat room with that name already exists.' });
        }

        const newChatRoom = new ChatRoom({
            name,
            description,
            isPrivate: isPrivate || false, // Default to false if not provided
            admin,
            members: [admin] 
        });

        const createdRoom = await newChatRoom.save();

        res.status(201).json({
            message: 'Chat room created successfully!',
            room: createdRoom
        });
    } catch (error) {
        console.error('Error creating chat room:', error);
        next(error);
    }
};

export const getAllChatRooms = async (req, res, next) => {
    try {
        // Find all public chat rooms, and optionally populate admin/member names
        const chatRooms = await ChatRoom.find({ isPrivate: false })
                                        .populate('admin', 'username avatar') // Populate admin details
                                        .select('-members -__v'); // Exclude members array and __v

        res.status(200).json({
            message: 'Public chat rooms retrieved successfully!',
            rooms: chatRooms
        });
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        next(error);
    }
};

export const getChatRoomDetails = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; 
    const userId = req.user.id; 

    try {
        const chatRoom = await ChatRoom.findById(id)
                                    .populate('admin', 'username avatar')
                                    .populate('members', 'username avatar status'); 

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found.' });
        }

        // Check if user is a member of the private room
        if (chatRoom.isPrivate && !chatRoom.members.some(member => member._id.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied. You are not a member of this private chat room.' });
        }
        // For public rooms, anyone can view details once authenticated

        // Fetch recent messages for the room (e.g., last 50, adjust as needed for pagination)
        const messages = await Message.find({ chatRoom: id })
                                      .sort({ timestamp: 1 }) // Ascending order
                                      .limit(50) // Adjust limit for initial load
                                      .populate('sender', 'username avatar'); 

        res.status(200).json({
            message: 'Chat room details retrieved successfully!',
            room: chatRoom,
            messages: messages
        });
    } catch (error) {
        console.error('Error fetching chat room details:', error);
        next(error);
    }
};


export const joinChatRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user.id; 

    try {
        const chatRoom = await ChatRoom.findById(id);

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found.' });
        }

      
        if (chatRoom.isPrivate && chatRoom.admin.toString() !== userId) {
            return res.status(403).json({ message: 'This is a private chat room. You need an invitation or admin approval to join.' });
        }


        // Check if user is already a member
        if (chatRoom.members.includes(userId)) {
            return res.status(400).json({ message: 'You are already a member of this chat room.' });
        }

        chatRoom.members.push(userId);
        await chatRoom.save();

        res.status(200).json({
            message: 'Successfully joined chat room!',
            room: chatRoom
        });

    } catch (error) {
        console.error('Error joining chat room:', error);
        next(error);
    }
};

export const leaveChatRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; 
    const userId = req.user.id; 

    try {
        const chatRoom = await Message.findById(id);

        if (!chatRoom) {
            return res.status(404).json({ success:false, message: 'Chat room not found.' });
        }

        if (!chatRoom.members.includes(userId)) {
            return res.status(400).json({success:false, message: 'You are not a member of this chat room.' });
        }


        // Remove user from members array
        chatRoom.members = chatRoom.members.filter(member => member.toString() !== userId);
        await chatRoom.save();

        res.status(200).json({ success:true,
            message: 'Successfully left chat room!',
            room: chatRoom
        }); 

    } catch (error) {
        console.error('Error leaving chat room:', error);
        next(error);
    }
};