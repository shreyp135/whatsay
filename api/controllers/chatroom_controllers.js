import Chatroom from "../models/chatroom_model";
import Message from "../models/message_model";
import User from "../models/user_model";


export const getChatrooms = async(req, res) => {
    try{
        const chatrooms = await Chatroom.find
        res.status(200).json({chatrooms});
    }catch(err){
        res.status(500).json({error: err});
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

