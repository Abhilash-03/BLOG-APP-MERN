import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';
import userRouter from '../routes/user.route.js';
import authRouter from '../routes/auth.route.js';
import postRouter from '../routes/post.route.js';
import cookieParser from 'cookie-parser';
import commentRouter from '../routes/comment.route.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
const corsOptions = {
    origin: ['https://akjblogs.vercel.app', 'http://localhost:5173'], // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specified headers
    credentials: true 
  };
  
  // Enable CORS with the configured options
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());    

app.get('/', (req, res) => {
    res.send('Hello MERN BLOG APP server')
})

// routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comment', commentRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

const start = () => {
        connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}...`)
        })
}

start();