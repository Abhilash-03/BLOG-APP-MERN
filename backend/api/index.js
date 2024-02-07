import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello MERN BLOG APP server')
})

const start = () => {
        connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}...`)
        })
}

start();