import Chatroom from "../models/chatroom_model.js";

export const getChatrooms = async(req, res) => {
    try{
        const user_id = req.user._id;
        if (!user_id) {
            user_id = null;
        }
        const chatRooms = await Chatroom.find({})
        .populate('users', 'id username isactive') 
        .populate('createdBy', 'id username'); 
        
        const activeChatRooms = [];
        const dormantChatRooms = [];

        for (const chatRoom of chatRooms) {
            const isUserInRoom = chatRoom.users.some(user => user.id === user_id); 
      
            if (!isUserInRoom) {
              const hasActiveUsers = chatRoom.users.some(user => user.isActive); 
      
              if (hasActiveUsers) {
                activeChatRooms.push(chatRoom);
              } else {
                dormantChatRooms.push(chatRoom);
              }
            }
          }     
        res.status(200).json({activeChatRooms, dormantChatRooms}); 

    }catch(err){
        res.status(500).json({message:"Error getting all chatrooms",error: err});
    }
};

export const getMessages = async(req, res) => {
    const chatroomId = req.params.chatroomId;
    try{
        const chatroom = await Chatroom.findById(chatroomId).populate('messages');
        res.status(200).json({messages: chatroom.messages});
    }catch(err){
        res.status(500).json({error: err});
    }
}

export const createChatroom = async(req, res) => {
    // console.log("hello");
    const {name} = req.body;
    const userId = req.user._id;
    try{
        const chatroom = new Chatroom({name, created_by: userId});
        await chatroom.save();
        res.status(201).json({chatroom});
    }catch(err){
        res.status(500).json({error: err});
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

export const muteChatroom = async(req, res) => {
    const chatroomId = req.params.chatroomId;
    try{
        const chatroom = await Chatroom.findById(chatroomId);
        chatroom.ismuted = !chatroom.ismuted;
        await chatroom.save();
        res.status(200).json({message: "Chatroom muted successfully"});
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

export const getUserChatrooms = async(req, res) => {
    const userId = req.user._id;
    try{
        const chatrooms = await Chatroom.find({created_by: userId});
        res.status(200).json({chatrooms});
    }catch(err){
        res.status(500).json({error: err});
    }
}

export const getAdminChatrooms = async(req, res) => {
    const userId = req.user._id;
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
