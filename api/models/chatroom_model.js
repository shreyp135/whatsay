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
        type: Boolean,
        default: false,
        required: true  
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;