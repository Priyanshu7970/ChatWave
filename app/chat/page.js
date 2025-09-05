'use client';

import Image from 'next/image';
import React, { useEffect, useState, useRef, useContext } from 'react';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';
import { EllipsisVertical, LogOut, SendHorizontal, UserPlus, Users, Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SocketContext } from '../context/socketProvider';
import { IoMdArrowBack } from "react-icons/io";


const allUsers = [
    { _id: '60c72b2f9f1b2c001f8e4a9c', name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1' },
    { _id: '60c72b2f9f1b2c001f8e4a9d', name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2' },
    { _id: '60c72b2f9f1b2c001f8e4a9e', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3' },
    { _id: '60c72b2f9f1b2c001f8e4a9f', name: 'David', avatar: 'https://i.pravatar.cc/150?img=4' },
    { _id: '60c72b2f9f1b2c001f8e4a10', name: 'Eve', avatar: 'https://i.pravatar.cc/150?img=5' },
    { _id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/150?img=10' }, // Current user's mock data
];

// Mock chat data structured according to the Mongoose schemas
// const initialChats = [
//     {
//         _id: 'chat_dm_1', // This would be the ChatRoom ObjectId
//         name: 'Alice',
//         isPrivate: true,
//         members: ['60c72b2f9f1b2c001f8e4a9c', currentUserId],
//         messages: [
//             {
//                 _id: 'msg_dm_1_1',
//                 sender: '60c72b2f9f1b2c001f8e4a9c',
//                 content: [{ type: 'text', text: 'Hi!' }],
//                 timestamp: '2025-06-14T10:28:00Z',
//                 readBy: [currentUserId],
//             },
//             {
//                 _id: 'msg_dm_1_2',
//                 sender: currentUserId,
//                 content: [{ type: 'text', text: 'Hello Alice!' }],
//                 timestamp: '2025-06-14T10:29:00Z',
//                 readBy: ['60c72b2f9f1b2c001f8e4a9c'],
//             },
//             {
//                 _id: 'msg_dm_1_3',
//                 sender: '60c72b2f9f1b2c001f8e4a9c',
//                 content: [{ type: 'text', text: 'How are you doing?' }],
//                 timestamp: '2025-06-14T10:30:00Z',
//                 readBy: [currentUserId],
//             },
//         ],
//     },
//     {
//         _id: 'chat_dm_2',
//         name: 'Bob',
//         isPrivate: true,
//         members: ['60c72b2f9f1b2c001f8e4a9d', currentUserId],
//         messages: [
//             {
//                 _id: 'msg_dm_2_1',
//                 sender: currentUserId,
//                 content: [{ type: 'text', text: 'Meeting at 3 PM?' }],
//                 timestamp: '2025-06-13T15:00:00Z',
//                 readBy: ['60c72b2f9f1b2c001f8e4a9d'],
//             },
//             {
//                 _id: 'msg_dm_2_2',
//                 sender: '60c72b2f9f1b2c001f8e4a9d',
//                 content: [{ type: 'text', text: 'Sounds good!' }],
//                 timestamp: '2025-06-13T15:05:00Z',
//                 readBy: [currentUserId],
//             },
//         ],
//     },
//     {
//         _id: 'chat_group_1',
//         name: 'Family Group',
//         isPrivate: false,
//         members: [currentUserId, '60c72b2f9f1b2c001f8e4a9c', '60c72b2f9f1b2c001f8e4a9e'],
//         admin: '60c72b2f9f1b2c001f8e4a9c', // Alice is the admin
//         avatar: 'https://i.pravatar.cc/150?img=8',
//         messages: [
//             {
//                 _id: 'msg_group_1_1',
//                 sender: '60c72b2f9f1b2c001f8e4a9c',
//                 content: [{ type: 'text', text: 'Hi everyone!' }],
//                 timestamp: '2025-06-20T09:00:00Z',
//                 readBy: [currentUserId, '60c72b2f9f1b2c001f8e4a9e'],
//             },
//             {
//                 _id: 'msg_group_1_2',
//                 sender: '60c72b2f9f1b2c001f8e4a9e',
//                 content: [{ type: 'text', text: 'Good morning!' }],
//                 timestamp: '2025-06-20T09:01:00Z',
//                 readBy: [currentUserId],
//             },
//             {
//                 _id: 'msg_group_1_3',
//                 sender: currentUserId,
//                 content: [{ type: 'text', text: 'Let\'s plan for the vacation!' }],
//                 timestamp: '2025-06-20T09:05:00Z',
//                 readBy: ['60c72b2f9f1b2c001f8e4a9c', '60c72b2f9f1b2c001f8e4a9e'],
//             },
//             {
//                 _id: 'msg_group_1_4',
//                 sender: '60c72b2f9f1b2c001f8e4a9c',
//                 content: [{ type: 'image', fileUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9491?w=500&q=80', fileName: 'vacation-spot.jpg' }],
//                 timestamp: '2025-06-20T09:10:00Z',
//                 readBy: [currentUserId],
//             },
//         ],
//     },
// ];

const getDisplayInfo = async (chat, currentUserId) => {
    // ... your logic for fetching display info
    // Make sure to handle the case for group chats where `isPrivate` is false  
      console.log("This is my chat...");
     console.log(chat);
    if (chat.isPrivate === false) {
        return { username: chat.name, avatar: chat.avatar || 'group_default_avatar.avif' };
    }
    const token = localStorage.getItem('token');
    const otherMember = chat.members.find(member => member._id !== currentUserId);

    // Add a check to prevent errors if otherMember is not found
    if (!otherMember) {
        return { username: 'Unknown User', avatar: 'default_avatar.avif' };
    }

    try {
        const response = await fetch(`http://localhost:8000/api/users/${otherMember}`, {
            method: 'GET',
            headers: {
                'auth-token': `${token}`
            }
        });
        const data = await response.json();
        if (data.success === true) {
            return { username: data.username, avatar: data.avatar };
        }
    } catch (err) {
        console.error("Failed to fetch display info:", err);
    }
    return { username: 'Unknown User', avatar: 'default_avatar.avif' };
};
const getSenderInfo = async (senderId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/users/${senderId}`, {
        method: 'GET',
        headers: {
            'auth-token': `${token}`
        }
    });
    const data = await response.json();
    if (data.success === true) { 
        return data.user;
    }
    return null;
};


// --- ChatApp Component ---
const ChatApp = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [chats, setChats] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [alert, setAlert] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [foundExistingUser, setFoundExistingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [matchingUsers, setMatchingUsers] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [currentUserId, setCurrentUserId] = useState('');
    const [senderInfoCache, setSenderInfoCache] = useState({});
    const [chatsWithInfo, setChatsWithInfo] = useState([]);
        const [newUserName, setNewUserName] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [hoveredUser, setHoveredUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [chatToRemove,setchatToRemove] = ([]);

    const { sendMessage, messages, handleSetMessage, receivedMessage } = useContext(SocketContext);

    // --- Hooks and Refs ---
    const router = useRouter();
    const menuRef = useRef(null);
    const ellipsisRef = useRef(null);
    const messagesEndRef = useRef(null);

    // --- Handlers ---
    const handleClickMenu = () => {
        setShowMenu(prev => !prev);
    };

    const handleLeaveChat = async (chatToLeave) => {
        try {
            // In a real app, you would make an API call here.
            // await fetch(`/api/chatrooms/${chatToLeave._id}/leave`, { method: 'POST' });
            setAlert({ message: `Successfully left ${chatToLeave.isPrivate ? 'chat' : 'group'}!`, type: 'success' });
            setChats(prevChats => prevChats.filter(chat => chat._id !== chatToLeave._id));
            setFilteredChats(prevFiltered => prevFiltered.filter(chat => chat._id !== chatToLeave._id));
            setSelectedChat(null);
        } catch (error) {
            console.error('Error leaving chat:', error);
            setAlert({ message: 'An error occurred while trying to leave the chat.', type: 'error' });
        } finally {
            setShowMenu(false);
        }
    };

    // Missing handler
    const  handleRemoveFriend = async(chatToRemove) => {

        // Implement logic to remove friend
        // For example, an API call followed by state update  
        try{
         const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/chatrooms/${chatToRemove._id}/leave`,{
            method:"GET",
            headers:{
                'Content-Type':"application/json",
                'auth-token':`${token}`
            }
            
        }); 
        if(response.ok){
            console.log("The chat is lived....");
        setChats(prevChats => prevChats.filter(chat => chat._id !== chatToRemove._id));
        setFilteredChats(prevFiltered => prevFiltered.filter(chat => chat._id !== chatToRemove._id));
        setSelectedChat(null);
        setShowMenu(false);
        setAlert({ message: `Chat with friend removed.`, type: 'success' });
        }
        else {
            // Handle HTTP errors (e.g., 404, 500)
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to remove friend.');
        }
    }
    catch(error){
        console.log(error); 
    }
    };

    const handleSendMessage = () => {
        if (!selectedChat || !inputMessage.trim()) return;

        const newMessage = {
            sender: currentUserId,
            type: 'text',
            text: inputMessage.trim(),
            timestamp: new Date().toISOString()
        };

        // Optimistically update the selected chat's messages
        setSelectedChat(prevChat => ({
            ...prevChat,
            content: [...prevChat.content, newMessage]
        }));

        // Update the chats state immutably.
        const updatedChats = chats.map(chat =>
            chat._id === selectedChat._id
                ? {
                    ...chat,
                    content: [...chat.content, newMessage],
                }
                : chat
        );
        setChats(updatedChats);

        setInputMessage('');

        // Send message via socket
        sendMessage({ id: selectedChat._id, content: newMessage });
    };

    const handleAddNewUser = async (user) => { 
        console.log("This is my user from handle add new user");
        console.log(user);
        const token = localStorage.getItem('token');
        if (!newUserName.trim()) {
            setAlert({ message: 'User name cannot be empty!', type: 'error' });
            return;
        }

        const receiverId = user._id;
        const chatAlreadyExists = chats.some(chat =>
            chat.isPrivate && chat.members.some(member => member._id === receiverId)
        );

        if (chatAlreadyExists) {
            setAlert({ message: `Chat with ${user.username} already exists!`, type: 'error' });
            setShowAddUserModal(false);
            setNewUserName('');
            setFoundExistingUser(null);
            return;
        } else {
            const response = await fetch(`http://localhost:8000/api/messages/direct/${receiverId}`, {
                method: "POST",
                headers: {
                    "auth-token": `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: "", type: 'text'
                })
            });
            const data = await response.json();
            if (data.success === true) { 
                console.log("This is my add new user chat.....");
                console.log(data.chat);
                setChats(prev => ([...prev, data.chat]));
                setFilteredChats(prev => ([...prev, data.chat]));
                setNewUserName('');
                setFoundExistingUser(null);
                setShowAddUserModal(false);
                setAlert({ message: `Chat with ${user.username} added successfully!`, type: 'success' });
            }
        }
    };

    // Missing handler
    const handleSelectUser = (user) => {
        console.log(`User ${user.username} selected.`);
        setNewUserName(user.username);
        setMatchingUsers([]);
    };

    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const debouncedSearchUsersRef = useRef(
        debounce(async (searchQuery) => {
            const token = localStorage.getItem('token');
            if (searchQuery.trim() === '') {
                setMatchingUsers([]);
                setFoundExistingUser(null);
                return;
            }
            try {
                const response = await fetch(`http://localhost:8000/api/users/allusers?search=${searchQuery.trim()}`, {
                    headers: { 'auth-token': `${token}` }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const filtered = data.filter(user => user._id !== currentUserId);
                setMatchingUsers(filtered);
            } catch (error) {
                console.error("Error fetching users:", error);
                setMatchingUsers([]);
            }
        }, 500)
    );

    const handleNewUserNameChange = (e) => {
        const name = e.target.value;
        setNewUserName(name);
        debouncedSearchUsersRef.current(name);
    };

    const fetchChats = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/messages/my-chats', {
                headers: { 'auth-token': `${token}` }
            });
            const data = await response.json();
            // FIX: Set chats directly to the array from the API response.
            setChats(data.chats);
            setFilteredChats(data.chats);
        } catch (e) {
            console.error('Failed to fetch chats:', e);
            setError('Failed to load chats. Please try again later.');
            setAlert({ message: 'Failed to load chats. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // --- Effects ---

    // Effect for filtering chats based on search term
    useEffect(() => {
        const fetchChatDisplayInfo = async () => {
            setLoading(true);
            setError(null);
            try {
                const chatsWithPromises = filteredChats.map(async (chat) => {
                    const displayInfo = await getDisplayInfo(chat, currentUserId);
                    return { ...chat, displayInfo };
                });
                const resolvedChats = await Promise.all(chatsWithPromises);
                setChatsWithInfo(resolvedChats);
            } catch (err) {
                setError("Failed to load chat information.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (filteredChats.length > 0) {
            fetchChatDisplayInfo();
        } else {
            setChatsWithInfo([]);
            setLoading(false);
        }

    }, [filteredChats, currentUserId]);


    // Fetch user and chats on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUserAndChats = async () => {
            if (!token) {
                router.push('/authentication/login');
                return;
            }

            try {
                const userResponse = await fetch('http://localhost:8000/api/users/getuser', {
                    method: 'GET',
                    headers: { 'auth-token': `${token}` }
                });
                const userData = await userResponse.json();
                if (userData.success === true) {
                    setCurrentUserId(userData.user._id);
                    // Fetch chats only after getting the user ID
                    await fetchChats();
                } else {
                    router.push('/authentication/login');
                }
            } catch (error) {
                console.error('Failed to fetch user or chats:', error);
                router.push('/authentication/login');
            }
        };

        fetchUserAndChats();
    }, []);

    // Effect for auto-scrolling to the last message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);



    // Render messages with sender info using the cached data
    const renderMessages = () => {
        return messages.map((message, index) => {
            const isSent = message.sender === currentUserId;
            const sender = senderInfoCache[message.sender];

            return (
                <div key={index} className={`flex mb-4 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    {!isSent && selectedChat.isPrivate === false && sender && (
                        <Image
                            width={32}
                            height={32}
                            src={`/${sender.avatar}`}
                            alt={`${sender.username}'s avatar`}
                            className="w-8 h-8 rounded-full mr-3 self-end hidden sm:block"
                        />
                    )}
                    <div
                        className={`relative max-w-[80%] sm:max-w-xl px-4 py-2 rounded-lg shadow
                            ${isSent ? 'bg-[#8c52ff] text-white' : 'bg-[#2a2a4e] text-white'}
                            ${isSent ? 'rounded-br-none' : 'rounded-bl-none'}`}
                    >
                        {selectedChat.isPrivate === false && !isSent && sender && (
                            <p className="text-xs font-semibold text-gray-300 mb-1">
                                {sender.username}
                            </p>
                        )}
                        {message.type === 'text' && (
                            <p className='mb-1 mr-1 text-sm sm:text-base break-words'>{message.text}</p>
                        )}
                        <span className={`absolute bottom-0 text-xs ${isSent ? 'text-purple-200 right-2' : 'text-gray-400 right-2'}`} style={{ fontSize: '0.6rem' }}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            );
        });
    };


    return (
        <div>
            <Navbar />
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="flex h-screen antialiased text-gray-800">
                <div className="flex flex-row h-full w-full">
                    {/* Sidebar */}
                    <div
                        className={`flex flex-col flex-none w-full sm:w-96 max-w-sm bg-[#1a1a2e] text-white border-r border-[#3a3a5e]
                            ${selectedChat ? 'hidden lg:flex' : 'flex flex-1'}
                            ${selectedChat && 'sm:hidden'} `}
                    // On small screens, hide sidebar if a chat is selected
                    >
                        <div className="p-4 flex flex-col">
                            <div className="flex justify-between py-2">
                                <h1 className="text-2xl font-semibold text-white">Chats</h1>
                                <button
                                    onClick={() => setShowAddUserModal(true)}
                                    className="flex items-center justify-center cursor-pointer text-white"
                                >
                                    <UserPlus className="mr-2" size={24} />
                                </button>
                            </div>
                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full pl-10 pr-4 py-2 border border-[#3a3a5e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c52ff] bg-[#2a2a4e] text-white placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Chat Accounts List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <p className="p-4 text-gray-400 text-center">Loading chats...</p>
                            ) : error ? (
                                <p className="p-4 text-red-400 text-center">{error}</p>
                            ) : chatsWithInfo.length > 0 ? (
                                chatsWithInfo.map((chat) => { 
                                    const lastMessage = 
                                     messages.length > 0
                                        ? messages[messages.length - 1]
                                        :  chat.content[chat.content.length-1];

                                    const lastMessageContent = (lastMessage?.type === 'text' && lastMessage.text)
                                        ? lastMessage.text
                                        : 'No messages yet';

                                    return (
                                        <div
                                            key={`${chat._id}`}
                                            className={`flex items-center p-4 cursor-pointer hover:bg-[#2a2a4e] ${selectedChat && selectedChat._id === chat._id ? 'bg-[#3a3a5e]' : ''}`}
                                            onClick={() => { setSelectedChat(chat); handleSetMessage(chat.content); }}
                                        >
                                            <Image
                                                width={64}
                                                height={64}
                                                src={`/${chat.displayInfo.avatar}`}
                                                alt={`${chat.displayInfo.username}'s avatar`}
                                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-lg text-white">
                                                        {chat.displayInfo.username} {chat.isPrivate === false && '(Group)'}
                                                    </h3>
                                                    <span className="text-sm text-gray-400">
                                                        {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 text-sm truncate">
                                                    {lastMessageContent}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="p-4 text-gray-400 text-center">No chats found. Add a user.</p>
                            )}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div
                        className={`flex flex-col bg-[#0f0f1d] border-l border-[#3a3a5e] flex-1
                            ${selectedChat ? 'flex' : 'hidden lg:flex'}`}
                    // On small screens, hide chat area if no chat is selected
                    >
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="bg-[#1a1a2e] p-4 border-b border-[#3a3a5e] flex items-center shadow-sm relative">
                                    <button
                                        onClick={() => setSelectedChat(null)}
                                        className="lg:hidden text-white mr-3 text-2xl" // Larger back button for mobile
                                    >
                                        <IoMdArrowBack />
                                    </button>
                                    <Image
                                        width={40}
                                        height={40}
                                        src={`/${selectedChat.displayInfo.avatar}`}
                                        alt={`${selectedChat.displayInfo.username}'s avatar`}
                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                    />
                                    <h2 className="font-semibold text-xl text-white">
                                        {selectedChat.displayInfo?.username} {selectedChat.isPrivate === false && '(Group)'}
                                    </h2>
                                    <EllipsisVertical onClick={handleClickMenu} className='text-white absolute right-5 cursor-pointer' ref={ellipsisRef} />
                                    <div
                                        className={`absolute right-1 bg-[#3a3a5e] rounded-sm shadow-lg transform transition-all duration-300 ease-in-out
                                            ${showMenu ? 'top-16 opacity-100 visible' : 'invisible -top-full opacity-0'} z-10`}
                                        ref={menuRef}
                                    >
                                        {selectedChat.isPrivate === false ? (
                                            <button
                                                onClick={() => { handleLeaveChat(selectedChat) }}
                                                className="px-6 py-3 text-red-500 flex items-center hover:bg-[#2a2a4e] w-full text-left cursor-pointer"
                                            >
                                                <LogOut className='text-red-500 mr-2' size={18} />
                                                <span>Leave Group</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { handleRemoveFriend(selectedChat) }}
                                                className="px-6 py-3 text-red-500 flex items-center hover:bg-[#2a2a4e] w-full text-left cursor-pointer"
                                            >
                                                <LogOut className='text-red-500 mr-2' size={18} /> {/* Using LogOut icon for remove friend for consistency */}
                                                <span>Leave</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Message Area */}
                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                                    {messages.length > 0 ? (
                                        messages.map((message) => {
                                            const sender = getSenderInfo(message.sender);
                                            const isSent = message.sender === currentUserId;

                                           return (
                                                <div
                                                    key={message.timestamp}
                                                    className={`flex mb-4 ${isSent ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {!isSent && selectedChat.isPrivate === false && (
                                                        <Image
                                                            width={32}
                                                            height={32}
                                                            src={`/${sender.avatar}`}
                                                            alt={`${sender.name}'s avatar`}
                                                            className="w-8 h-8 rounded-full mr-3 self-end hidden sm:block" // Hide on very small screens for compact view
                                                        />
                                                    )}
                                                    <div
                                                        className={`relative max-w-[80%] sm:max-w-xl px-4 py-2 rounded-lg shadow
                                                            ${isSent ? 'bg-[#8c52ff] text-white' : 'bg-[#2a2a4e] text-white'}
                                                            ${isSent ? 'rounded-br-none' : 'rounded-bl-none'}`}
                                                    >
                                                        {selectedChat.isPrivate === false && !isSent && (
                                                            <p className="text-xs font-semibold text-gray-300 mb-1">
                                                                {sender?.name || 'Unknown'}
                                                            </p>
                                                        )}
                                                        {message.type === 'text' && (
                                                            <p className='mb-1 mr-1 text-sm sm:text-base break-words'>{message.text}</p>
                                                        )}
                                                        <span className={`absolute bottom-0 text-xs ${isSent ? 'text-purple-200 right-2' : 'text-gray-400 right-2'}`} style={{ fontSize: '0.6rem' }}>
                                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="p-4 text-gray-400 text-center">No messages yet. Start the conversation!</p>
                                    )}
                                    <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                                </div>

                                {/* Message Input */}
                                <div className="bg-[#1a1a2e] p-4 border-t sticky bottom-0 border-[#3a3a5e] flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 sm:py-4 rounded-lg selection:bg-indigo-600 border border-[#3a3a5e] focus:outline-none focus:ring-2 focus:ring-[#8c52ff] bg-[#2a2a4e] text-white placeholder-gray-400 text-sm sm:text-base"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (inputMessage.length > 0) {
                                                    handleSendMessage();
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        className={`font-bold py-2 px-4 rounded-lg flex items-center ml-3 text-sm sm:text-base
                                            ${inputMessage.length > 0
                                                ? 'bg-[#8c52ff] hover:bg-[#7a3bff] text-white'
                                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            }`}
                                        onClick={handleSendMessage}
                                        disabled={inputMessage.length === 0}
                                    >
                                        <SendHorizontal className='text-white' size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-lg p-4 text-center">
                                Select a chat to start messaging, or add a new user/group to begin!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add New User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a2e] p-6 rounded-lg shadow-xl w-full max-w-sm border border-[#3a3a5e]">
                        <h2 className="text-xl font-bold mb-4 text-white">Add New User</h2>
                        <input
                            type="text"
                            placeholder="Enter user's name"
                            className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 bg-[#2a2a4e] text-white placeholder-gray-400 border-[#3a3a5e] focus:ring-[#8c52ff]"
                            value={newUserName}
                            onChange={handleNewUserNameChange}
                        />

                        {/* User Search Results */}
                        {newUserName.trim() && (
                            <div className="max-h-60 overflow-y-auto mt-2 custom-scrollbar">
                                {matchingUsers.length > 0 ? (
                                    matchingUsers.map(user => (
                                        <div
                                            key={user._id}
                                            className="flex items-center justify-between p-2 my-1 rounded-lg hover:bg-[#2a2a4e] cursor-pointer transition-colors duration-200"
                                            onMouseEnter={() => setHoveredUser(user._id)}
                                            onMouseLeave={() => setHoveredUser(null)}
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            <div className="flex items-center">
                                                <Image src={`/Default_avatar.avif`} width={32} height={32} alt={`${user.username}'s avatar`} className="w-8 h-8 rounded-full mr-3 object-cover" />
                                                <span className="text-white font-medium">{user.username}</span>
                                            </div>
                                            {hoveredUser === user._id && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAddNewUser(user); }}
                                                    className="px-3 py-1 text-sm hover:cursor-pointer bg-[#8c52ff] text-white rounded-lg hover:bg-[#7a3bff] transition duration-200 ease-in-out"
                                                >
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm p-2">No users found.</p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => { setShowAddUserModal(false); setNewUserName(''); setFilteredUsers([]); setHoveredUser(null); }}
                                className="px-4 py-2 mr-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatApp;