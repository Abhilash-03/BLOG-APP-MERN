import mongoose from 'mongoose'

const connectDB = (url) => {
    mongoose.connect(url)
    .then(() => console.log('MONGODB IS CONNETED!!!'))
    .catch((error) => console.log(error.message));
}

export default connectDB;