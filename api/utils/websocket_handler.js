import message from '../models/message_model.js';
import Chatroom from '../models/chatroom_model.js';
import User from '../models/user_model.js';

const websocket_handler = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection established: ', socket.id);

        //joining room
        socket.on('join_room', async ({ userId, chatroomid }) => {
            console.log(userId);
            console.log(chatroomid);
            try {
                if (!userId || ! chatroomid) {
                    console.error('Missing userId or chatroomId');
                    return;
                }

                const chatroom = await Chatroom.findById(chatroomid).populate('users', '_id username isactive');
                if (!chatroom) {
                    console.error(`Chatroom with ID ${chatroomid} not found`);
                    return;
                }

                const user = await User.findById(userId);
                if (!user) {
                    console.error(`User with ID ${userId} not found`);
                    return;
                }

                user.isactive = true;
                await user.save();

                const isUserInRoom = chatroom.users.some((u) => u._id.toString() === user._id.toString());
                if (!isUserInRoom) {
                    chatroom.users.push(user);
                    await chatroom.save();
                }

                socket.join(chatroomid);
                console.log(`Socket ${socket.id} joined room ${chatroomid}`);

                io.to(chatroomid).emit('updated_users', chatroom.users);
            } catch (err) {
                console.error('Error in join_room:', err);
            }
        });
        
        //sending message
        socket.on('send_message', async ({ chatroomid, userId, text }) => {
            try {
                if (!text || !chatroomid || !userId) {
                    console.error('Invalid data in send_message');
                    return;
                }

                const user = await User.findById(userId);
                if (!user) {
                    console.error(`User with ID ${userId} not found`);
                    return;
                }

                const newMessage = new message({
                    content: text,
                    user_id: userId,
                    timestamp: new Date().getTime(),
                });

                const savedMessage = await newMessage.save();

                await Chatroom.findByIdAndUpdate(chatroomid, { $push: { messages: savedMessage._id } });

                io.to(chatroomid).emit('receive_message', {
                    id: savedMessage._id,
                    username: user.username,
                    userId: user._id,
                    text: savedMessage.content,
                    timestamp: savedMessage.timestamp,
                });
            } catch (err) {
                console.error('Error in send_message:', err);
            }
        });

        //leaving room
        socket.on('leave_room', async ({ userId, chatroomid }) => {
            try {
                if (!userId || !chatroomid) {
                    console.error('Missing userId or chatroomId in leave_room');
                    return;
                }

                const user = await User.findById(userId);
                if (!user) {
                    console.error(`User with ID ${userId} not found`);
                    return;
                }

                const chatroom = await Chatroom.findById(chatroomid).populate('users', '_id username isactive');
                if (!chatroom) {
                    console.error(`Chatroom with ID ${chatroomid} not found`);
                    return;
                }

                user.isactive = false;
                await user.save();

                chatroom.users = chatroom.users.filter((u) => u._id.toString() !== user._id.toString());
                await chatroom.save();

                socket.leave(chatroomid);
                console.log(`Socket ${socket.id} left room ${chatroomid}`);

                io.to(chatroomid).emit('updated_users', chatroom.users);
            } catch (err) {
                console.error('Error in leave_room:', err);
            }
        });

        // Disconnect
        socket.on('disconnect', async () => {
            console.log('Connection disconnected: ', socket.id);
        });
    });
};

export default websocket_handler;
