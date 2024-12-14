import Chatroom from "../models/chatroom_model.js";

export const getChatrooms = async(req, res) => {
    try{
        const chatRooms = await Chatroom.find({})
        .populate('users', '_id username isactive')
        .populate("created_by", "username");

        const activeChatRooms = [];
        const dormantChatRooms = [];

        for (const chatRoom of chatRooms) {
              if (chatRoom.users && chatRoom.users.length > 0) {
                activeChatRooms.push(chatRoom);
              } else {
                dormantChatRooms.push(chatRoom);
              }
            }
             
        res.status(200).json({activeChatRooms, dormantChatRooms}); 

    }catch(err){
        res.status(500).json({message:"Error getting all chatrooms",error: err});
    }
};

export const getMessages = async(req, res) => {
    try{
        const chatroomId = req.headers.chatroomid;
        console.log(chatroomId, "ok");
        const chatroom = await Chatroom.findById(chatroomId)
        .populate({
          path: 'messages',
          select: 'content timestamp user_id', 
          populate: {
            path: 'user_id',
            select: 'username',
          },
        });
        const messagesFormatted = chatroom.messages.map(message => {
            return {
                _id: message._id.toString(),
                text: message.content,
                timestamp: message.timestamp,
                username: message.user_id.username,
                userId: message.user_id._id.toString(),
            }
        });

        res.status(200).json({name:chatroom.name , messages: messagesFormatted});
    }catch(err){
        res.status(500).json({message:err,error: err});
    }
}

export const createChatroom = async(req, res) => {
    const {name} = req.body;
    const userId = req.user.id;
    try{
        const chatroom = new Chatroom({name, created_by: userId});
        await chatroom.save();
        res.status(201).json({chatroom});
    }catch(err){
        res.status(500).json({message:err,error: err});
    }   
}

export const deleteChatroom = async(req, res) => {
    const chatroomId = req.params.chatroomId;
    try{
        await Chatroom.findByIdAndDelete(chatroomId);
        res.status(200).json({message: "Chatroom deleted successfully"});
    }catch(err){
        res.status(500).json({error: err});
    }
}


export const getChatroomInfo = async(req, res) => {
    const chatroomId = req.params.chatroomId;
    try{
        const chatroom = await Chatroom.findById(chatroomId);
        res.status(200).json({chatroom});
    }catch(err){
        res.status(500).json({error: err});
    }
}

export const getAdminChatrooms = async(req, res) => {
    const userId = req.user.id;
    try{
        const chatrooms = await Chatroom.find({created_by: userId});
        res.status(200).json({chatrooms});

    }catch(err){
        res.status(500).json({error: err});
    }
}

export const editChatroom = async(req, res) => {  
    const chatroomId = req.params.chatroomId;
    const {name} = req.body;
    try{
        const chatroom = await Chatroom.findById(chatroomId);
        chatroom.name = name;
        await chatroom.save();
        res.status(200).json({message: "Chatroom updated successfully"});
    }
    catch(err){
        res.status(500).json({message: err.message ,error: err});
    }
}
