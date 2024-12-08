import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth_routes.js';
import cookieParser from 'cookie-parser';

//env file config
dotenv.config();

//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB server successfully');
});

//configure express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//api routes
app.use("/api/auth", authRoutes);


//server start
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});


