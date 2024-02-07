import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';
import userRouter from '../routes/user.route.js';
import authRouter from '../routes/auth.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello MERN BLOG APP server')
})

// routes
app.use('/api/v1/test', userRouter);
app.use('/api/v1/auth', authRouter);

const start = () => {
        connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}...`)
        })
}

start();