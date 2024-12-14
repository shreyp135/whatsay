import mongoose from "mongoose";

const chatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
        required: true  
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;