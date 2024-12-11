import message from '../models/message_model.js';

const websocket_handler = (socket) => {
    console.log('New connection established: ', socket.id);

    socket.on('join_room', (client) => {
        socket.join(client.roomId);
        console.log(`Socket ${socket.id} joined room ${client.roomId}`);
    });
    socket.on("send_message", async(client) => {
        const newMessage = new message({content: client.content, sender: client.sender});
        newMessage.save();

        await Chatroom.findByIdAndUpdate(message.roomId, {$push: {messages: newMessage._id}});
        socket.to(message.roomId).emit("receive_message", message);
    });
    

    socket.on('disconnect', () => {
        console.log('Connection disconnected: ', socket.id);
    });
};

export default websocket_handler;