import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth_routes.js';
import chatroomRoutes from './routes/chatroom_routes.js';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import websocketHandler from './utils/websocket_handler.js';
import cors from 'cors';


//env file config
dotenv.config();

//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB server successfully');
});

//configure express app and socket.io
const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server);

//socket.io connection
io.on('connection', websocketHandler);

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/chatroom", chatroomRoutes);

//server start
server.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});


