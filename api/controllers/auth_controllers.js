import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';


export const signup = async(req, res) => {
    const {username,email,password,role} = req.body;

    try{
        const newUser = new User;
        newUser.username = username;
        newUser.email = email;
        newUser.password = await bcrypt.hash(password, 15);
        if (role)
            newUser.role = role;
        else 
            newUser.role = "user";
        newUser.isactive = true;
        await newUser.save();
        console.log("User saved to database");
        res.status(201).json({message: "User created successfully"});
    } catch (err){
        res.status(500).json({error: err});
    }
};


export const signin = async(req, res) => {
    const {username, password} = req.body;

    try{
        const currUser = await User.findOne({$or: [{email: username}, {username: username}]});
        if (!currUser) 
            return res.status(404).json({message: "User not found"});
        const isUser = await bcrypt.compare(password, currUser.password);
        if(!isUser) 
            return res.status(401).json({message: "Wrong password"});
        const token  = jwt.sign({ id: currUser._id,role: currUser.role }, process.env.TOKEN_SECRET);
        res.cookie('token', token, {httpOnly: true, secure: false, sameSite: 'lax', expires: new Date(Date.now() + 3600000*24)}); //cookie expires in 24 hours
        res.status(200).json({message: "User signed in successfully", token, user: currUser});
    }catch(err){
        res.status(500).json({message:"Error logging in", error: err});
    }
};

export const signout = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "User signed out successfully"});
};